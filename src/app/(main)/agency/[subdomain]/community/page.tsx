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
  const hasScrolledInitially = useRef(false);
  const queryClient = useQueryClient();
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

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

  const { data: communities, isLoading: communitiesLoading, isError: communitiesError } = useQuery({
    queryKey: ['get-communities'],
    queryFn: async () => {
      const response = await axiosInstance.get(`community/${schemaName}/get-communities`);
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
  
  

  const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newMessage.trim()) {
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current?.send(JSON.stringify({ content: newMessage, contenttype: "1" }));
      }
      setNewMessage('');
      setTimeout(() => {
        messagesContainerRef.current?.scrollTo({
          top: messagesContainerRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }, 100);
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
      const message = JSON.parse(event.data);
      console.log(message)

      queryClient.setQueryData(['get-messages', selectedCommunity.id], (oldData: any) => {
        const newPages = oldData.pages.map((page: any, index: number) =>
          index === 0 ? { ...page, results: [message.message , ...page.results, ] } : page
        );
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

  const messages = messageData?.pages.flatMap(page => page.results).reverse() || [];

  return (
    <div className="flex h-[90dvh] bg-background">
      <div className="w-64 bg-sidebar flex-shrink-0 border-r border-sidebar-border">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-sidebar-foreground text-gradient">Communities</h2>
          <ul className="mt-4 space-y-2">
            {communities && communities.map((community: any) => (
              <li key={community.id}>
                <button
                  onClick={() => setSelectedCommunity(community)}
                  className={`w-full flex items-center p-2 rounded-md text-sm ${
                    selectedCommunity.id === community.id
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent'
                  }`}
                >
                  <span className="mr-2">{community.icon}</span>
                  {community.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

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
              <div key={message.id} className="mb-4 flex gap-3 items-start">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={message.profile_pic} alt={message.full_name} />
                  <AvatarFallback>
                    {message.full_name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center">
                    <span className="font-semibold text-primary">{message?.full_name}</span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      {message.timestamp}
                    </span>
                  </div>
                  <p className="text-foreground">{message?.content}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">No messages yet.</p>
          )}
        </div>

       {communities && communities.length > 0 && ( <div className="p-4 border-t border-border bg-card">
          <form onSubmit={handleSendMessage} className="flex items-center">
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