"use client"

import axiosInstance from '@/axios/public-instance'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { DeviceTypes, useEditor } from '@/providers/editor/editor-provider'
import { RootState } from '@/Redux/store'
import { useMutation } from '@tanstack/react-query'
import clsx from 'clsx'
import { ArrowLeftCircle, EyeIcon, Laptop, Redo2, Smartphone, SmartphoneIcon, Tablet, TabletIcon, Undo2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'

type Props = {
    webId : string
    pageDetails : any

}




const WebEditorNavigation = ({webId , pageDetails}: Props) => {
  const {schemaName} = useSelector((state:RootState)=>state.app)
    const router = useRouter()
    const {state , dispatch} = useEditor()
    useEffect(() => {
     dispatch({
        type : 'SET_FUNNELPAGE_ID',
        payload : {
          funnelPageId : pageDetails.id,
        },
 
     })
    }, [webId])



    

    // const handleOnBlurTitleChange: FocusEventHandler<HTMLInputElement> = async (
    //     event
    //   ) => {
    //     if (event.target.value === funnelPageDetails.name) return
    //     if (event.target.value) {
    //       await upsertFunnelPage(
    //         subaccountId,
    //         {
    //           id: funnelPageDetails.id,
    //           name: event.target.value,
    //           order: funnelPageDetails.order,
    //         },
    //         funnelId
    //       )
    
    //       toast('Success', {
    //         description: 'Saved Funnel Page title',
    //       })
    //       router.refresh()
    //     } else {
    //       toast('Oppse!', {
    //         description: 'You need to have a title!',
    //       })
    //       event.target.value = funnelPageDetails.name
    //     }
    //   }
    const handlePreviewClick = () => {
        dispatch({ type: 'TOGGLE_PREVIEW_MODE' })
        dispatch({ type: 'TOGGLE_LIVE_MODE' })
      }
    
      const handleUndo = () => {
        dispatch({ type: 'UNDO' })
      }
    
      const handleRedo = () => {
        dispatch({ type: 'REDO' })
      }

      
      const handleOnSave = async ()=>{
        const response = await axiosInstance.put(`builder/${schemaName}/website/${webId}`,{
          web_data : state.editor.elements
        })
        if (response.status==200){
          toast.success("Saved Successfully" , {
            description: "Changes saved successfully",
          })
        }

        
      }

      const updateMutation = useMutation({
        mutationKey : ['update-website']
      })
    

  return (
   <TooltipProvider>
    <nav className={clsx(
          'border-b-[1px] flex items-center justify-between p-6 gap-2 transition-all',
          { '!h-0 !p-0 !overflow-hidden': state.editor.previewMode }
        )}>
             <aside className="flex items-center gap-4 max-w-[260px] w-[300px]">
             <Link href={`/admin/builder`}>
            <ArrowLeftCircle />
          </Link>
          <div className="flex flex-col w-full ">
            <Input
              defaultValue={pageDetails.name}
              className="border-none h-5 m-0 p-0 text-lg font-bold"
            //   onBlur={handleOnBlurTitleChange}
            />
            <span className="text-sm text-muted-foreground">
              {/* Path: /{funnelPageDetails.pathName} */}
            </span>
          </div>
        </aside> 

        <aside>
          <Tabs
            defaultValue="Desktop"
            className="w-fit "
            value={state.editor.device}
            onValueChange={(value) => {
              dispatch({
                type: 'CHANGE_DEVICE',
                payload: { device: value as DeviceTypes },
              })
            }}
          >
            <TabsList className="grid w-full grid-cols-3 bg-transparent h-fit">
              <Tooltip>
                <TooltipTrigger >
                  <TabsTrigger
                    value="Desktop"
                    className="data-[state=active]:bg-muted w-10 h-10 p-0"
                  >
                    <Laptop />
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Desktop</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger >
                  <TabsTrigger
                    value="Tablet"
                    className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                    
                  >
                    <TabletIcon />
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Tablet</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger >
                  <TabsTrigger
                    value="Mobile"
                    className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                  >
                    <SmartphoneIcon />
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Mobile</p>
                </TooltipContent>
              </Tooltip>
            </TabsList>
          </Tabs>
        </aside>         
        <aside className="flex items-center gap-2">
          <Button
            variant={'ghost'}
            size={'icon'}
            className="hover:bg-slate-800"
            onClick={handlePreviewClick}
          >
            <EyeIcon />
          </Button>
          <Button
            disabled={!(state.history.currentIndex > 0)}
            onClick={handleUndo}
            variant={'ghost'}
            size={'icon'}
            className="hover:bg-slate-800"
          >
            <Undo2 />
          </Button>
          <Button
            disabled={
              !(state.history.currentIndex < state.history.history.length - 1)
            }
            onClick={handleRedo}
            variant={'ghost'}
            size={'icon'}
            className="hover:bg-slate-800 mr-4"
          >
            <Redo2 />
          </Button>
          {/* <div className="flex flex-col item-center mr-4"> */}
            {/* <div className="flex flex-row items-center gap-4">
              Draft
              <Switch
              
                disabled
                defaultChecked={true}
              />
              Publish
            </div> */}
            {/* <span className="text-muted-foreground text-sm">
              Last updated  */}
              {/* {pageDetails.updatedAt.toLocaleDateString()} */}
            {/* </span> */}
          {/* </div> */}
          <Button onClick={handleOnSave}>Save</Button>
        </aside>
        </nav>
   </TooltipProvider>
  )
}

export default WebEditorNavigation