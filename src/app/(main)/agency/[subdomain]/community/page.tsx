"use client";

import axiosInstance from '@/axios/public-instance';
import { RootState } from '@/Redux/store';
import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState, FormEvent, ChangeEvent, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import debounce from 'lodash/debounce';
import { Spinner } from '@/app/components/ui/spinner';
import withSubscriptionCheck from '@/HOC/subscription-check';
import Messages from './_components/messages';
import CommunitySidebar from './_components/community-sidebar';
import { extractUrl } from '@/constants';
import { v4 as uuidv4 } from 'uuid';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus } from 'lucide-react';
import { toast } from 'sonner';


interface Community {
  id: number;
  name: string;
  tenant: string;
  created_at?: string;
  updated_at?: string;
}

interface Message {
  id: number;
  user: string;
  text: string;
  timestamp: string;
  profile_pic?: string;
  full_name?: string;
  content?: string;
}

const Page: React.FC = () => {
  const ws = useRef<WebSocket | null>(null);
  const { schemaName } = useSelector((state: RootState) => state.app);
  const { user } = useSelector((state: RootState) => state.user);
  const hasScrolledInitially = useRef(false);
  const queryClient = useQueryClient();
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [filesOpen, setFilesOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleOpen = ()=>{
    setFilesOpen(!handleOpen)
  }

  const isUserNearTop = (): boolean => {
    const container = messagesContainerRef.current;
    if (!container) return false;
    const threshold = 100;
    return container.scrollTop < threshold;
  };


  const isUserNearBottom = (): boolean => {
    const container = messagesContainerRef.current;
    if (!container) return false;
    const threshold = 100;
    const position = container.scrollTop + container.clientHeight;
    const height = container.scrollHeight;
    return height - position < threshold;
  };

  const hasPermission = (user?.hasCommunityPermission && user?.is_staff)|| user?.is_admin
  const urlEnd = hasPermission ? 'get-community-admin' : 'get-communities'

  const { data: communities, isLoading: communitiesLoading, isError: communitiesError } = useQuery({
    queryKey: ['get-communities'],
    queryFn: async () => {
      const response = await axiosInstance.get(`community/${schemaName}/${urlEnd}`);
      return response.data;
    },
  });

  const [selectedCommunity, setSelectedCommunity] = useState<Community>({
    name: "",
    tenant: "",
    id: 0,
  });

  const [newMessage, setNewMessage] = useState<string>('');

  useEffect(() => {
    if (communities && communities.length > 0) {
      setSelectedCommunity(communities[0]);
    }
  }, [communities]);

  const { data: messageData, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } = useInfiniteQuery({
    queryKey: ['get-messages', selectedCommunity.id],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await axiosInstance.get(`community/${schemaName}/get-messages/${selectedCommunity.id}?page=${pageParam}`);
      console.log('API Response:', response.data); // Debug log
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      const currentPage = Number(lastPage?.current_page ?? 1);
      return lastPage?.next && Number.isFinite(currentPage)
        ? currentPage + 1
        : undefined;
    }
    ,
    enabled: !!selectedCommunity && selectedCommunity.id > 0,
    initialPageParam: 1,
  });

  const handleScroll = useCallback(
    debounce(() => {
      if (isUserNearTop() && hasNextPage && !isFetchingNextPage && !isFetchingMore && !isFetching) {
        setIsFetchingMore(true);
        const previousScrollHeight = messagesContainerRef.current?.scrollHeight || 0;
        fetchNextPage().finally(() => {
          if (messagesContainerRef.current) {
            const newScrollHeight = messagesContainerRef.current.scrollHeight;
            messagesContainerRef.current.scrollTop = newScrollHeight - previousScrollHeight;
          }
          setIsFetchingMore(false);
        });
      }
    }, 300),
    [hasNextPage, isFetchingNextPage, isFetchingMore, fetchNextPage, isFetching]
  );

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => {
        container.removeEventListener('scroll', handleScroll);
        handleScroll.cancel();
      };
    }
  }, [handleScroll]);

  useEffect(() => {
    if (!hasScrolledInitially.current && messageData?.pages?.length && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      hasScrolledInitially.current = true;
    }
  }, [messageData]);



  const linkMetadata = async (link: string) => {
  try{
      const response = await axiosInstance.get(`community/${schemaName}/get-link-data?url=${link}`)
    return response.data
  }catch{
    return null
  }
}

const uploadImage = async (file : FormData)=>{
  const response = await axiosInstance.post(`mediamanager/${schemaName}/upload-tenant` , file)
  return response.data
}
const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>)=>{
  const file = e.target.files?.[0];
    if (!file) return;

   
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image.");
      return;
    }
    const url = URL.createObjectURL(file);
     const optimisticUUID = uuidv4();

    const tempMessage = {
      id: optimisticUUID,
      optimistic_uuid: optimisticUUID,
      user: user?.id,
      created_at: new Date().toISOString(),
      content: url,
      isOptimistic: true,
      profile_pic : user?.user?.profile_pic,
      contenttype : "2",
      link : extractUrl(newMessage)
    };
    queryClient.setQueryData(['get-messages', selectedCommunity.id], (oldData: any) => {
      if (!oldData) return;
      const newPages = oldData.pages.map((page: any, index: number) =>
        index === 0 ? { ...page, results: [tempMessage, ...page.results] } : page
      );
      return { ...oldData, pages: newPages };
    });
     const shouldScroll = isUserNearBottom();
     if (shouldScroll) {
        setTimeout(() => {
          messagesContainerRef.current?.scrollTo({
            top: messagesContainerRef.current.scrollHeight,
            behavior: 'smooth',
          });
        }, 100);
      }


    // console.log("Uploading:", file);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("content_type", "chat");
    try {
      const data = await uploadImage(formData)
        if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(
          JSON.stringify({
            content: data?.image,
            contenttype: "2",
            optimistic_uuid: optimisticUUID,
            link:  null,
          })
        );
      }
      
    }catch{
 queryClient.setQueryData(['get-messages', selectedCommunity.id], (oldData: any) => {
        if (!oldData) return;
        const newPages = oldData.pages.map((page: any) => ({
          ...page,
          results: page.results.filter((msg: any) => msg.optimistic_uuid !== optimisticUUID),
        }));
        return { ...oldData, pages: newPages };
      });
    }



}

  const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedCommunity) return;

    const optimisticUUID = uuidv4();

    const tempMessage = {
      id: optimisticUUID,
      optimistic_uuid: optimisticUUID,
      user: user?.id,
      created_at: new Date().toISOString(),
      content: newMessage,
      isOptimistic: true,
      profile_pic : user?.user?.profile_pic,
      contenttype : "1",
      link : extractUrl(newMessage)
    };

    queryClient.setQueryData(['get-messages', selectedCommunity.id], (oldData: any) => {
      if (!oldData) return;
      const newPages = oldData.pages.map((page: any, index: number) =>
        index === 0 ? { ...page, results: [tempMessage, ...page.results] } : page
      );
      return { ...oldData, pages: newPages };
    });
    const shouldScroll = isUserNearBottom();
     if (shouldScroll) {
        setTimeout(() => {
          messagesContainerRef.current?.scrollTo({
            top: messagesContainerRef.current.scrollHeight,
            behavior: 'smooth',
          });
        }, 100);
      }

    setNewMessage('');

    // if (shouldScroll) {
    //   setTimeout(() => {
    //     messagesContainerRef.current?.scrollTo({
    //       top: messagesContainerRef.current.scrollHeight,
    //       behavior: 'smooth',
    //     });
    //   }, 100);
    // }

    try {
      const link = extractUrl(newMessage);
      const linkData = link ? await linkMetadata(link) : null;

      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(
          JSON.stringify({
            content: newMessage,
            contenttype: "1",
            optimistic_uuid: optimisticUUID,
            link: linkData?.title ? linkData : null,
          })
        );
      }
    } catch (error) {
      queryClient.setQueryData(['get-messages', selectedCommunity.id], (oldData: any) => {
        if (!oldData) return;
        const newPages = oldData.pages.map((page: any) => ({
          ...page,
          results: page.results.filter((msg: any) => msg.optimistic_uuid !== optimisticUUID),
        }));
        return { ...oldData, pages: newPages };
      });
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
  };

  useEffect(() => {
    if (!selectedCommunity || selectedCommunity.id === 0) return;

    const socketUrl = `ws://localhost/community/${schemaName}/ws/chat/${selectedCommunity.id}/`;
    ws.current = new WebSocket(socketUrl);

    ws.current.onmessage = (event) => {
      const shouldScroll = isUserNearBottom();
      const message = JSON.parse(event.data)?.message;

      if (!message) return;

      queryClient.setQueryData(['get-messages', selectedCommunity.id], (oldData: any) => {
        if (!oldData) return;

        const newPages = oldData.pages.map((page: any, index: number) => {
          if (index !== 0) return page;

          const updatedResults = page.results.map((msg: any) =>
            msg.optimistic_uuid && msg.optimistic_uuid === message.optimistic_uuid
              ? { ...message, replacedOptimistic: true }
              : msg
          );

          const hasReplaced = updatedResults.some((msg:any) => msg.id === message.id);
          return {
            ...page,
            results: hasReplaced ? updatedResults : [message, ...updatedResults],
          };
        });

        return { ...oldData, pages: newPages };
      });

      if (shouldScroll) {
        setTimeout(() => {
          messagesContainerRef.current?.scrollTo({
            top: messagesContainerRef.current.scrollHeight,
            behavior: 'smooth',
          });
        }, 100);
      }
    };


    ws.current.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.current.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      ws.current?.close();
    };
  }, [selectedCommunity, queryClient]);

  const toastEr = ()=>{
    toast.warning("Message" , {
      description : "This feature is turned off now!"
    })
  }

  const messages = messageData?.pages.flatMap(page => page.results).reverse() || [];

  return (
    <div className="flex h-[90dvh] bg-background">
      <CommunitySidebar communities={communities} selectedCommunity={selectedCommunity} setSelectedCommunity={setSelectedCommunity} communitiesLoading={communitiesLoading} />

      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-border bg-card">
          <h1 className="text-xl font-bold text-foreground">{selectedCommunity.name}</h1>
        </div>

        <div ref={messagesContainerRef} className="flex-1 p-4 overflow-y-auto">
          {isFetchingNextPage && (
            <Spinner size={'small'} />
          )}
          {messages.length > 0 ? (
            messages.map((message: any) => (
              <Messages key={message.id} message={message} />
            ))
          ) : (
            <p className="text-muted-foreground">No messages yet.</p>
          )}
        </div>

        {communities && communities.length > 0 && (<div className="p-4 border-t border-border bg-card">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <DropdownMenu open={filesOpen} onOpenChange={(open)=>{setFilesOpen(open)}}>
  <DropdownMenuTrigger><Plus className={`transition-transform duration-300 ease-in-out ${filesOpen ? "rotate-45" : "rotate-0"}`} /></DropdownMenuTrigger>
  <DropdownMenuContent  align='start'>
   
    <DropdownMenuItem onClick={()=>{
    fileInputRef.current?.click()
    }}>
                      Images

    </DropdownMenuItem>
    <DropdownMenuItem onClick={toastEr}>Videos</DropdownMenuItem>
    <DropdownMenuItem onClick={toastEr}>Documents</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>


                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                      
                      />
            <input
              type="text"
              value={newMessage}
              onChange={handleInputChange}
              placeholder="Type a message..."
              className="flex-1 p-2 rounded-md border border-input bg-background text-foreground focus:ring-2 focus:ring-ring"
            />
            <button
              type="submit"
              className="ml-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Send
            </button>
          </form>
        </div>)}
      </div>
    </div>
  );
};

export default withSubscriptionCheck(React.memo(Page));