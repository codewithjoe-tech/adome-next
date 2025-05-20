'use client'
import React, { ChangeEventHandler } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  AlignCenter,
  AlignHorizontalJustifyCenterIcon,
  AlignHorizontalJustifyEndIcon,
  AlignHorizontalJustifyStart,
  AlignHorizontalSpaceAround,
  AlignHorizontalSpaceBetween,
  AlignJustify,
  AlignLeft,
  AlignRight,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd,
  AlignVerticalJustifyStart,
  ChevronsLeftRightIcon,
  Expand,
  LayoutGrid,
  LucideImage,
  LucideImageDown,
  MapPin,
  MoveHorizontal,
  Square,
} from 'lucide-react'
import { Tabs, TabsTrigger, TabsList } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useEditor } from '@/providers/editor/editor-provider'
import { Slider } from '@/components/ui/slider'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import BackgroundColorPicker from '@/components/editor/background-image-picker'

type Props = {}

const SettingsTab = (props: Props) => {
  const { state, dispatch } = useEditor()

  const handleOnChanges = (e: any) => {
    const styleSettings = e.target.id
    let value = e.target.value
    const styleObject = {
      [styleSettings]: value,
    }

    dispatch({
      type: 'UPDATE_ELEMENT',
      payload: {
        elementDetails: {
          ...state.editor.selectedElement,
          styles: {
            ...state.editor.selectedElement.styles,
            ...styleObject,
          },
        },
      },
    })
  }

  const handleChangeCustomValues = (e: any) => {
    const settingProperty = e.target.id
    let value = e.target.value
    const styleObject = {
      [settingProperty]: value,
    }

    dispatch({
      type: 'UPDATE_ELEMENT',
      payload: {
        elementDetails: {
          ...state.editor.selectedElement,
          content: {
            ...state.editor.selectedElement.content,
            ...styleObject,
          },
        },
      },
    })
  }

  return (
    <Accordion
      type="multiple"
      className="w-full"
      defaultValue={['Typography', 'Dimensions', 'Decorations', 'Flexbox']}
    >
      <AccordionItem
        value="Custom"
        className="px-6 py-0  "
      >
        <AccordionTrigger className="!no-underline">Custom</AccordionTrigger>
        <AccordionContent>
          {state.editor.selectedElement.type === 'link' &&
            !Array.isArray(state.editor.selectedElement.content) && (
              <div className="flex flex-col gap-2">
                <p className="text-muted-foreground">Link Path</p>
                <Input
                  id="href"
                  placeholder="https:domain.example.com/pathname"
                  onChange={handleChangeCustomValues}
                  value={state.editor.selectedElement.content.href}
                />
              </div>
            )}
        </AccordionContent>
      </AccordionItem>
      <AccordionItem
        value="Typography"
        className="px-6 py-0  border-y-[1px]"
      >
        <AccordionTrigger className="!no-underline">
          Typography
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-2 ">
          <div className="flex flex-col gap-2 ">
            <p className="text-muted-foreground">Text Align</p>
            <Tabs
              onValueChange={(e) =>
                handleOnChanges({
                  target: {
                    id: 'textAlign',
                    value: e,
                  },
                })
              }
              value={state.editor.selectedElement.styles.textAlign}
            >
              <TabsList className="flex items-center flex-row justify-between border-[1px] rounded-md bg-transparent h-fit gap-4">
                <TooltipProvider>
                      <TabsTrigger
                        value="left"
                        className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                      >
                  <Tooltip>
                    <TooltipTrigger asChild>
                        <AlignLeft size={18} />
                    </TooltipTrigger>
                    <TooltipContent side="top">Align Left</TooltipContent>
                  </Tooltip>
                      </TabsTrigger>

                      <TabsTrigger
                        value="right"
                        className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                      >
                  <Tooltip>
                    <TooltipTrigger asChild>
                        <AlignRight size={18} />
                    </TooltipTrigger>
                    <TooltipContent side="top">Align Right</TooltipContent>
                  </Tooltip>
                      </TabsTrigger>

                      <TabsTrigger
                        value="center"
                        className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                      >
                  <Tooltip>
                    <TooltipTrigger asChild>
                        <AlignCenter size={18} />
                    </TooltipTrigger>
                    <TooltipContent side="top">Align Center</TooltipContent>
                  </Tooltip>
                      </TabsTrigger>

                      <TabsTrigger
                        value="justify"
                        className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                      >
                  <Tooltip>
                    <TooltipTrigger asChild>
                        <AlignJustify size={18} />
                    </TooltipTrigger>
                    <TooltipContent side="top">Justify</TooltipContent>
                  </Tooltip>
                      </TabsTrigger>
                </TooltipProvider>
              </TabsList>
            </Tabs>

          </div>
          <div className="flex flex-col gap-2">
            <p className="text-muted-foreground">Font Family</p>
            <Input
              id="DM Sans"
              onChange={handleOnChanges}
              value={state.editor.selectedElement.styles.fontFamily}
            />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-muted-foreground">Color</p>
            <div className="flex  border-[1px] rounded-md overflow-clip">
              {/* <div
                className="w-12 "
                style={{
                  backgroundColor:
                    state.editor.selectedElement.styles.color,
                }}
              /> */} <BackgroundColorPicker state={state} id="color" dispatch = {dispatch}  key={state.editor.selectedElement.id} />

              <Input
                id="color"
                onChange={handleOnChanges}
                value={state.editor.selectedElement.styles.color}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div>
              <Label className="text-muted-foreground">Weight</Label>
              <Select
                onValueChange={(e) =>
                  handleOnChanges({
                    target: {
                      id: 'fontWeight',
                      value: e,
                    },
                  })
                }
                defaultValue='normal'
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a weight" />
                </SelectTrigger>
                <SelectContent className='bg-themeBlack'>
                  <SelectGroup>
                    <SelectLabel>Font Weights</SelectLabel>
                    <SelectItem value="bold">Bold</SelectItem>
                    <SelectItem value="normal">Regular</SelectItem>
                    <SelectItem value="lighter">Light</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-muted-foreground">Size</Label>
              <Input
                placeholder="px"
                id="fontSize"
                onChange={handleOnChanges}
                value={state.editor.selectedElement.styles.fontSize}
              />
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem
        value="Dimensions"
        className=" px-6 py-0 "
      >
        <AccordionTrigger className="!no-underline">
          Dimensions
        </AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex gap-4 flex-col">
                <div className="flex gap-4">
                  <div>
                    <Label className="text-muted-foreground">Height</Label>
                    <Input
                      id="height"
                      placeholder="px"
                      onChange={handleOnChanges}
                      value={state.editor.selectedElement.styles.height}
                    />
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Width</Label>
                    <Input
                      placeholder="px"
                      id="width"
                      onChange={handleOnChanges}
                      value={state.editor.selectedElement.styles.width}
                    />
                  </div>
                </div>
              </div>
              <p>Margin px</p>
              <div className="flex gap-4 flex-col">
                <div className="flex gap-4">
                  <div>
                    <Label className="text-muted-foreground">Top</Label>
                    <Input
                      id="marginTop"
                      placeholder="px"
                      onChange={handleOnChanges}
                      value={state.editor.selectedElement.styles.marginTop}
                    />
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Bottom</Label>
                    <Input
                      placeholder="px"
                      id="marginBottom"
                      onChange={handleOnChanges}
                      value={state.editor.selectedElement.styles.marginBottom}
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div>
                    <Label className="text-muted-foreground">Left</Label>
                    <Input
                      placeholder="px"
                      id="marginLeft"
                      onChange={handleOnChanges}
                      value={state.editor.selectedElement.styles.marginLeft}
                    />
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Right</Label>
                    <Input
                      placeholder="px"
                      id="marginRight"
                      onChange={handleOnChanges}
                      value={state.editor.selectedElement.styles.marginRight}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p>Padding px</p>
              <div className="flex gap-4 flex-col">
                <div className="flex gap-4">
                  <div>
                    <Label className="text-muted-foreground">Top</Label>
                    <Input
                      placeholder="px"
                      id="paddingTop"
                      onChange={handleOnChanges}
                      value={state.editor.selectedElement.styles.paddingTop}
                    />
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Bottom</Label>
                    <Input
                      placeholder="px"
                      id="paddingBottom"
                      onChange={handleOnChanges}
                      value={state.editor.selectedElement.styles.paddingBottom}
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div>
                    <Label className="text-muted-foreground">Left</Label>
                    <Input
                      placeholder="px"
                      id="paddingLeft"
                      onChange={handleOnChanges}
                      value={state.editor.selectedElement.styles.paddingLeft}
                    />
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Right</Label>
                    <Input
                      placeholder="px"
                      id="paddingRight"
                      onChange={handleOnChanges}
                      value={state.editor.selectedElement.styles.paddingRight}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem
        value="Decorations"
        className="px-6 py-0 "
      >
        <AccordionTrigger className="!no-underline">
          Decorations
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4">
          <div>
            <Label className="text-muted-foreground">Opacity</Label>
            <div className="flex items-center justify-end">
              <small className="p-2">
                {typeof state.editor.selectedElement.styles?.opacity ===
                  'number'
                  ? state.editor.selectedElement.styles?.opacity
                  : parseFloat(
                    (
                      state.editor.selectedElement.styles?.opacity || '0'
                    ).replace('%', '')
                  ) || 0}
                %
              </small>
            </div>
            <Slider
              onValueChange={(e) => {
                handleOnChanges({
                  target: {
                    id: 'opacity',
                    value: `${e[0]}%`,
                  },
                })
              }}
              defaultValue={[
                typeof state.editor.selectedElement.styles?.opacity === 'number'
                  ? state.editor.selectedElement.styles?.opacity
                  : parseFloat(
                    (
                      state.editor.selectedElement.styles?.opacity || '0'
                    ).replace('%', '')
                  ) || 0,
              ]}
              max={100}
              step={1}
            />
          </div>
          <div>
            <Label className="text-muted-foreground">Border Radius</Label>
            <div className="flex items-center justify-end">
              <small className="">
                {typeof state.editor.selectedElement.styles?.borderRadius ===
                  'number'
                  ? state.editor.selectedElement.styles?.borderRadius
                  : parseFloat(
                    (
                      state.editor.selectedElement.styles?.borderRadius || '0'
                    ).replace('px', '')
                  ) || 0}
                px
              </small>
            </div>
            <Slider
              onValueChange={(e) => {
                handleOnChanges({
                  target: {
                    id: 'borderRadius',
                    value: `${e[0]}px`,
                  },
                })
              }}
              defaultValue={[
                typeof state.editor.selectedElement.styles?.borderRadius ===
                  'number'
                  ? state.editor.selectedElement.styles?.borderRadius
                  : parseFloat(
                    (
                      state.editor.selectedElement.styles?.borderRadius || '0'
                    ).replace('%', '')
                  ) || 0,
              ]}
              max={100}
              step={1}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground">Background Color</Label>
            <div className="flex  border-[1px] rounded-md overflow-clip">

                <BackgroundColorPicker state={state} id="background" dispatch = {dispatch}  key={state.editor.selectedElement.id}  />
              <Input
                placeholder="#HFI245"
                className="!border-y-0 rounded-none !border-r-0 mr-2"
                id="background"
                onChange={handleOnChanges}
                value={state.editor.selectedElement.styles.background}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground">Background Image</Label>
            <div className="flex  border-[1px] rounded-md overflow-clip">
            <div
                className="w-12 "
                style={{
                  backgroundColor:
                    state.editor.selectedElement.styles.backgroundColor,
                }}
              />
              <Input
                placeholder="url()"
                className="!border-y-0 rounded-none !border-r-0 mr-2"
                id="backgroundImage"
                onChange={handleOnChanges}
                value={state.editor.selectedElement.styles.backgroundImage}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-muted-foreground">Image Position</Label>
            <Tabs
              onValueChange={(e) =>
                handleOnChanges({
                  target: {
                    id: 'backgroundSize',
                    value: e,
                  },
                })
              }
              value={state.editor.selectedElement.styles.backgroundSize?.toString()}
            >
              <TabsList className="flex items-center flex-row justify-between border-[1px] rounded-md bg-transparent h-fit gap-4">
                <TooltipProvider>
                      <TabsTrigger value="cover" className="w-10 h-10 p-0 data-[state=active]:bg-muted">
                  <Tooltip>
                    <TooltipTrigger asChild>
                        <ChevronsLeftRightIcon size={18} />
                    </TooltipTrigger>
                    <TooltipContent>Cover</TooltipContent>
                  </Tooltip>
                      </TabsTrigger>

                      <TabsTrigger value="contain" className="w-10 h-10 p-0 data-[state=active]:bg-muted">
                  <Tooltip>
                    <TooltipTrigger asChild>
                        <AlignVerticalJustifyCenter size={22} />
                    </TooltipTrigger>
                    <TooltipContent>Contain</TooltipContent>
                  </Tooltip>
                      </TabsTrigger>

                      <TabsTrigger value="auto" className="w-10 h-10 p-0 data-[state=active]:bg-muted">
                  <Tooltip>
                    <TooltipTrigger asChild>
                        <LucideImageDown size={18} />
                    </TooltipTrigger>
                    <TooltipContent>Auto</TooltipContent>
                  </Tooltip>
                      </TabsTrigger>
                </TooltipProvider>
              </TabsList>
            </Tabs>

          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem
        value="Flexbox"
        className="px-6 py-0  "
      >
        <AccordionTrigger className="!no-underline">Flexbox</AccordionTrigger>
        <AccordionContent>
          <Label className="text-muted-foreground">Justify Content</Label>
          <Tabs
            onValueChange={(e) =>
              handleOnChanges({
                target: {
                  id: 'justifyContent',
                  value: e,
                },
              })
            }
            value={state.editor.selectedElement.styles.justifyContent}
          >
            <TabsList className="flex items-center flex-row justify-between border-[1px] rounded-md bg-transparent h-fit gap-4">
              <TooltipProvider>
                    <TabsTrigger value="space-between" className="w-10 h-10 p-0 data-[state=active]:bg-muted">
                <Tooltip>
                  <TooltipTrigger asChild>
                      <AlignHorizontalSpaceBetween size={18} />
                  </TooltipTrigger>
                  <TooltipContent>Space Between</TooltipContent>
                </Tooltip>
                    </TabsTrigger>

                    <TabsTrigger value="space-evenly" className="w-10 h-10 p-0 data-[state=active]:bg-muted">
                <Tooltip>
                  <TooltipTrigger asChild>
                      <AlignHorizontalSpaceAround size={18} />
                  </TooltipTrigger>
                  <TooltipContent>Space Evenly</TooltipContent>
                </Tooltip>
                    </TabsTrigger>

                    <TabsTrigger value="center" className="w-10 h-10 p-0 data-[state=active]:bg-muted">
                <Tooltip>
                  <TooltipTrigger asChild>
                      <AlignHorizontalJustifyCenterIcon size={18} />
                  </TooltipTrigger>
                  <TooltipContent>Center</TooltipContent>
                </Tooltip>
                    </TabsTrigger>

                    <TabsTrigger value="start" className="w-10 h-10 p-0 data-[state=active]:bg-muted">
                <Tooltip>
                  <TooltipTrigger asChild>
                      <AlignHorizontalJustifyStart size={18} />
                  </TooltipTrigger>
                  <TooltipContent>Start</TooltipContent>
                </Tooltip>
                    </TabsTrigger>

                    <TabsTrigger value="end" className="w-10 h-10 p-0 data-[state=active]:bg-muted">
                <Tooltip>
                  <TooltipTrigger asChild>
                      <AlignHorizontalJustifyEndIcon size={18} />
                  </TooltipTrigger>
                  <TooltipContent>End</TooltipContent>
                </Tooltip>
                    </TabsTrigger>
              </TooltipProvider>
            </TabsList>
          </Tabs>

          <Label className="text-muted-foreground">Align Items</Label>
          <TooltipProvider>
            <Tabs
              onValueChange={(e) =>
                handleOnChanges({
                  target: {
                    id: 'alignItems',
                    value: e,
                  },
                })
              }
              value={state.editor.selectedElement.styles.alignItems}
            >
              <TabsList className="flex items-center flex-row justify-between border-[1px] rounded-md bg-transparent h-fit gap-4">

                <TabsTrigger value="center" className="group w-10 h-10 p-0 data-[state=active]:bg-muted">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AlignVerticalJustifyCenter size={18} />
                    </TooltipTrigger>
                    <TooltipContent>Align Center</TooltipContent>
                  </Tooltip>
                </TabsTrigger>

                <TabsTrigger value="normal" className="group w-10 h-10 p-0 data-[state=active]:bg-muted">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AlignVerticalJustifyStart size={18} />
                    </TooltipTrigger>
                    <TooltipContent>Align Start</TooltipContent>
                  </Tooltip>
                </TabsTrigger>

              </TabsList>
            </Tabs>
          </TooltipProvider>


          <div className="flex items-center gap-2">
            <Input
              className="h-4 w-4"
              placeholder="px"
              type="checkbox"
              id="display"
              onChange={(va) => {
                handleOnChanges({
                  target: {
                    id: 'display',
                    value: va.target.checked ? 'flex' : 'block',
                  },
                })
              }}
            />
            <Label className="text-muted-foreground">Flex</Label>
          </div>
          <div>
            <Label className="text-muted-foreground"> Direction</Label>
            <Input
              placeholder="px"
              id="flexDirection"
              onChange={handleOnChanges}
              value={state.editor.selectedElement.styles.flexDirection}
            />
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value='Position'   className="px-6 py-0  " >
        <AccordionTrigger className="!no-underline">Position</AccordionTrigger>
        <AccordionContent>
          <Label className='text-muted-foreground'>Position</Label>
          <Tabs
           value={state.editor.selectedElement.styles.position || 'static'}
          onValueChange={(e:any)=>{
            if(state.editor.selectedElement.name !== "__body" ){
              handleOnChanges({
                target: {
                  id: 'position',
                  value: e,
                },
              });
            }
          }}
          >
            <TabsList className='flex items-center flex-row justify-between border-[1px] rounded-md bg-transparent h-fit gap-4'>
              <TooltipProvider>
                <TabsTrigger value='relative' className='w-10 h-10 p-0 data-[state=active]:bg-muted'>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <MoveHorizontal size={18} />
                    </TooltipTrigger>
                    <TooltipContent>Relative</TooltipContent>
                  </Tooltip>
                </TabsTrigger>

                <TabsTrigger value='absolute' className='w-10 h-10 p-0 data-[state=active]:bg-muted'>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Expand size={18} />
                    </TooltipTrigger>
                    <TooltipContent>Absolute</TooltipContent>
                  </Tooltip>
                </TabsTrigger>
                <TabsTrigger value='fixed' className='w-10 h-10 p-0 data-[state=active]:bg-muted'>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <MapPin size={18} />
                    </TooltipTrigger>
                    <TooltipContent>Fixed</TooltipContent>
                  </Tooltip>
                </TabsTrigger>
                <TabsTrigger value='sticky' className='w-10 h-10 p-0 data-[state=active]:bg-muted'>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Square size={18} />
                    </TooltipTrigger>
                    <TooltipContent>Sticky</TooltipContent>
                  </Tooltip>
                </TabsTrigger>
                <TabsTrigger value='static' className='w-10 h-10 p-0 data-[state=active]:bg-muted'>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <LayoutGrid size={18} />
                    </TooltipTrigger>
                    <TooltipContent>Static</TooltipContent>
                  </Tooltip>
                </TabsTrigger>
              </TooltipProvider>
            </TabsList>
          </Tabs>
          
          <div className="flex flex-col gap-2">
              <p>Positions</p>
              <div className="flex gap-4 flex-col">
                <div className="flex gap-4">
                  <div>
                    <Label className="text-muted-foreground">Top</Label>
                    <Input
                      placeholder="px"
                      id="top"
                      onChange={handleOnChanges}
                      value={state.editor.selectedElement.styles.top}
                    />
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Bottom</Label>
                    <Input
                      placeholder="px"
                      id="bottom"
                      onChange={handleOnChanges}
                      value={state.editor.selectedElement.styles.bottom}
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div>
                    <Label className="text-muted-foreground">Left</Label>
                    <Input
                      placeholder="px"
                      id="left"
                      onChange={handleOnChanges}
                      value={state.editor.selectedElement.styles.left}
                    />
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Right</Label>
                    <Input
                      placeholder="px"
                      id="right"
                      onChange={handleOnChanges}
                      value={state.editor.selectedElement.styles.right}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div>
                    <Label className="text-muted-foreground">Z Index</Label>
                    <Input
                      placeholder="0"
                      id="zIndex"
                      onChange={handleOnChanges}
                      value={state.editor.selectedElement.styles.zIndex}
                    />
                  </div>
        



        </AccordionContent>

      </AccordionItem>
    </Accordion>
  )
}

export default SettingsTab