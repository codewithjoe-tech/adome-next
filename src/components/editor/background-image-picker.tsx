import React, { useEffect, useReducer } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { HexColorPicker } from "react-colorful";
import { EditorState } from "@/providers/editor/editor-provider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditorAction } from "@/providers/editor/editor-action";
import { Slider } from "../ui/slider";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { ColorAction, ColorState } from "@/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { AlignCenter, AlignVerticalJustifyCenter, ChevronsLeftRightIcon, LucideImageDown, MoveDown, MoveLeft, MoveRight, MoveUp } from "lucide-react";
import { Input } from "../ui/input";
import { parseBackground } from "./get_initialStateProp";

type Props = {
  state: EditorState;
  bgImage?: boolean;
  id: string;
  dispatch: React.Dispatch<EditorAction>;
};

const solids = [
  '#E2E2E2', '#ff75c3', '#ffa647', '#ffe83f', '#9fff5b', '#70e2ff', '#cd93ff', '#09203f',
  '#ff5733', '#c70039', '#900c3f', '#581845', '#1b1b2f', '#3282b8', '#0f4c75', '#bbe1fa',
  '#2ecc71', '#27ae60', '#f1c40f', '#e67e22', '#d35400', '#34495e', '#2c3e50', '#ecf0f1',
  '#95a5a6', '#7f8c8d', '#ffcc00', '#ff6699', '#cc66ff', '#66ccff', '#ff4500', '#8b0000', '#ff1493', '#32cd32', '#008080',
  '#4682b4', '#bdb76b', '#ffdead', '#daa520', '#556b2f', '#ff4444', '#ffbb33', '#00c851', '#33b5e5', '#aa66cc',
  '#ff6b81', '#ff9f43', '#5f27cd', '#54a0ff', '#10ac84'
];

const gradients = [
  'linear-gradient(to top left, #accbee, #e7f0fd)',
  'linear-gradient(to top left, #d5d4d0, #eeeeec)',
  'linear-gradient(to top left, #000000, #434343)',
  'linear-gradient(to top left, #09203f, #537895)',
  'linear-gradient(to top left, #AC32E4, #7918F2, #4801FF)',
  'linear-gradient(to top left, #f953c6, #b91d73)',
  'linear-gradient(to top left, #ee0979, #ff6a00)',
  'linear-gradient(to top left, #F00000, #DC281E)',
  'linear-gradient(to top left, #00c6ff, #0072ff)',
  'linear-gradient(to top left, #4facfe, #00f2fe)',
  'linear-gradient(to top left, #0ba360, #3cba92)',
  'linear-gradient(to top left, #FDFC47, #24FE41)',
  'linear-gradient(to top left, #8a2be2, #0000cd, #228b22, #ccff00)',
  'linear-gradient(to top left, #40E0D0, #FF8C00, #FF0080)',
  'linear-gradient(to top left, #fcc5e4, #fda34b, #ff7882, #c8699e, #7046aa, #0c1db8, #020f75)',
  'linear-gradient(to top left, #ff75c3, #ffa647, #ffe83f, #9fff5b, #70e2ff, #cd93ff)',
  'linear-gradient(to right, #DAD299, #B0DAB9)',
  'linear-gradient(to right, #bdc3c7, #2c3e50)',
  'linear-gradient(to right, #2980B9, #6DD5FA, #FFFFFF)',
  'linear-gradient(to right, #2774ae, #002E5D, #002E5D)',
  'linear-gradient(to right, #434343, #000000)',
  'linear-gradient(to right, #833ab4, #fd1d1d, #fcb045)',
  'linear-gradient(to right, #b224ef, #7579ff)',
  'linear-gradient(to right, #ed6ea0, #ec8c69)',
  'linear-gradient(to right, #E3FDF5, #FFE6FA)',
  'linear-gradient(to right, #ff9a9e, #fad0c4)',
  'linear-gradient(to right, #ffdde1, #ee9ca7)',
  'linear-gradient(to right, #ff758c, #ff7eb3)',
  'linear-gradient(to right, #69ff97, #00e4ff)',
  'linear-gradient(to right, #fa709a, #fee140)',
  'linear-gradient(to right, #a8edea, #fed6e3)',
  'linear-gradient(to right, #6a11cb, #2575fc)',
  'linear-gradient(to right, #ff6a00, #ee0979)',
  'linear-gradient(to right, #1e9600, #fff200, #ff0000)',
  'linear-gradient(to right, #d53369, #cbad6d)',
  'linear-gradient(to right, #1a2980, #26d0ce)',
  'linear-gradient(to right, #360033, #0b8793)',
  'linear-gradient(to right, #ff512f, #dd2476)',
  'linear-gradient(to right, #1f4037, #99f2c8)',
  'linear-gradient(to right, #4b6cb7, #182848)',
  'linear-gradient(to right, #de6262, #ffb88c)',
  'linear-gradient(to right, #02aab0, #00cdac)',
  'linear-gradient(to right, #ffb347, #ffcc33)',
];

const images = [
  'url(https://images.unsplash.com/photo-1691200099282-16fd34790ade?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2532&q=90)',
  'url(https://images.unsplash.com/photo-1691226099773-b13a89a1d167?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2532&q=90)',
  'url(https://images.unsplash.com/photo-1688822863426-8c5f9b257090?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2532&q=90)',
  'url(https://images.unsplash.com/photo-1691225850735-6e4e51834cad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2532&q=90)',
];

const BackgroundColorPicker = ({ dispatch, state, bgImage = false, id: PropId }: Props) => {
  const background = state.editor.selectedElement.styles.background || "";
  const {
    gradient,
    direction,
    color1,
    color2,
    opacity1,
    opacity2,
    image,
    ImageSize,
    color,
  } = parseBackground(background as string);

  const initialState: ColorState = {
    color: color || "",
    opacity: opacity1 || 1,
    gradient: gradient || false,
    direction: direction || 'to right',
    color1: color1 || "#ffffff",
    color2: color2 || "#ffffff",
    image: image || "",
    opacity1: opacity1 || 1,
    opacity2: opacity2 || 1,
    selectedColor: 1,
    ImageSize: ImageSize || "cover",
  };

  const reducer = (state: ColorState, action: ColorAction): ColorState => {
    switch (action.type) {
      case "SET_COLOR":
        return { ...state, color: action.payload };
      case "SET_GRADIENT":
        return { ...state, gradient: action.payload, color1: action.payload ? state.color || "#ffffff" : state.color1 };
      case "SET_DIRECTION":
        return { ...state, direction: action.payload };
      case "SET_OPACITY":
        return { ...state, opacity: action.payload };
      case "SET_IMAGE":
        return { ...state, image: action.payload };
      case "SET_COLOR1":
        return { ...state, color1: action.payload };
      case "SET_COLOR2":
        return { ...state, color2: action.payload };
      case "SET_OPACITY1":
        return { ...state, opacity1: action.payload };
      case "SET_OPACITY2":
        return { ...state, opacity2: action.payload };
      case "SET_SELECTED_COLOR":
        return { ...state, selectedColor: action.payload };
      case "SET_IMAGE_SIZE":
        return { ...state, ImageSize: action.payload };
      case "RESET":
        return initialState;
      default:
        return state;
    }
  };

  const [colorState, colorDispatch] = useReducer(reducer, initialState);

  // Sync colorState when the selected element changes
  useEffect(() => {
    colorDispatch({ type: "RESET" , payload :initialState }); // Reset to initial state
    colorDispatch({ type: "SET_COLOR", payload: color || "" });
    colorDispatch({ type: "SET_GRADIENT", payload: gradient || false });
    colorDispatch({ type: "SET_DIRECTION", payload: direction || "to right" });
    colorDispatch({ type: "SET_COLOR1", payload: color1 || "#ffffff" });
    colorDispatch({ type: "SET_COLOR2", payload: color2 || "#ffffff" });
    colorDispatch({ type: "SET_OPACITY1", payload: opacity1 || 1 });
    colorDispatch({ type: "SET_OPACITY2", payload: opacity2 || 1 });
    colorDispatch({ type: "SET_IMAGE", payload: image || "" });
    colorDispatch({ type: "SET_IMAGE_SIZE", payload: ImageSize || "cover" });
  }, [state.editor.selectedElement.id, background]);

  const handleColorChange = (newColor: string) => {
    const styleObject = {
      [PropId]: newColor,
    };

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
    });
  };

  const hexToRgba = (color: string, alpha: number): string => {
    if (!color || color === "") return `rgba(255, 255, 255, ${alpha})`; // Default to white if color is empty

    if (color.startsWith('rgba')) {
      return color.replace(/[\d\.]+\)$/g, `${alpha})`);
    }

    if (color.startsWith('rgb')) {
      const values = color.match(/\d+/g);
      if (values && values.length === 3) {
        const [r, g, b] = values;
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      }
      return `rgba(255, 255, 255, ${alpha})`;
    }

    if (color.startsWith('#')) {
      let hex = color.replace('#', '');
      if (hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('');
      }

      if (hex.length === 6) {
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      }
    }

    return `rgba(255, 255, 255, ${alpha})`; // Fallback to white
  };

  const handleCustomColorChange = (newColor: string) => {
    if (colorState.gradient) {
      if (colorState.selectedColor === 1) {
        colorDispatch({ type: 'SET_COLOR1', payload: newColor });
      } else {
        colorDispatch({ type: 'SET_COLOR2', payload: newColor });
      }
    } else {
      colorDispatch({ type: 'SET_COLOR', payload: newColor });
    }
  };

  useEffect(() => {
    if (colorState.gradient) {
      let color = `linear-gradient(${colorState.direction}, ${hexToRgba(colorState.color1, colorState.opacity1)}, ${hexToRgba(colorState.color2, colorState.opacity2)})`;
      if (colorState.image) {
        color += `, url("${colorState.image}") no-repeat center / ${colorState.ImageSize || 'cover'}`;
      }
      handleColorChange(color);
    } else {
      const color = hexToRgba(colorState.color, colorState.opacity);
      handleColorChange(color);
    }
  }, [colorState]);

  const colorValue = (): string => {
    if (colorState.gradient) {
      if (colorState.selectedColor === 1) {
        return colorState.color1;
      } else {
        return colorState.color2;
      }
    }
    return colorState.color;
  };

  const onImageChange = (e: any) => {
    colorDispatch({ type: 'SET_IMAGE', payload: e.target.value });
  };

  const getOpacity = (): number => {
    if (colorState.gradient) {
      if (colorState.selectedColor === 1) {
        return colorState.opacity1;
      } else {
        return colorState.opacity2;
      }
    }
    return colorState.opacity;
  };

  const changeOpacity = (value: number): void => {
    if (colorState.gradient) {
      if (colorState.selectedColor === 1) {
        colorDispatch({ type: 'SET_OPACITY1', payload: value });
      } else {
        colorDispatch({ type: 'SET_OPACITY2', payload: value });
      }
    } else {
      colorDispatch({ type: 'SET_OPACITY', payload: value });
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div
          className="w-12 rounded border cursor-pointer"
          style={{
            background: state.editor.selectedElement.styles[PropId as keyof React.CSSProperties],
          }}
        />
      </PopoverTrigger>
      <PopoverContent className="w-60 max-h-96 overflow-y-auto p-4 flex flex-col gap-4">
        <Tabs defaultValue={'solid'} className="w-full">
          <TabsList className="w-full mb-4 sticky top-0 z-[99]">
            <TabsTrigger className="flex-1" value="solid">
              Solid
            </TabsTrigger>
            {(PropId === 'background' || PropId === 'backgroundColor') && (
              <TabsTrigger className="flex-1" value="gradient">
                Gradient
              </TabsTrigger>
            )}
            <TabsTrigger className="flex-1" value="custom">
              Custom
            </TabsTrigger>
            {bgImage && (
              <TabsTrigger className="flex-1" value="image">
                Image
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="solid" className="flex flex-wrap gap-1 mt-0">
            {solids.map((s) => (
              <div
                key={s}
                style={{ background: s }}
                className="rounded-md h-6 w-6 cursor-pointer active:scale-105"
                onClick={() => {
                  colorDispatch({ type: 'SET_COLOR', payload: s });
                  colorDispatch({ type: 'SET_GRADIENT', payload: false });
                  handleColorChange(s);
                }}
              />
            ))}
          </TabsContent>

          <TabsContent value="gradient" className="mt-0">
            <div className="flex flex-wrap gap-1 mb-2">
              {gradients.map((s) => (
                <div
                  key={s}
                  style={{ background: s }}
                  className="rounded-md h-6 w-6 cursor-pointer active:scale-105"
                  onClick={() => handleColorChange(s)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="image" className="mt-0">
            <div className="grid grid-cols-2 gap-1 mb-2">
              {images.map((s) => (
                <div
                  key={s}
                  style={{ backgroundImage: s }}
                  className="rounded-md bg-cover bg-center h-12 w-full cursor-pointer active:scale-105"
                  onClick={() => handleColorChange(s)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="custom">
            <HexColorPicker
              className="scale-75"
              color={colorValue()}
              onChange={handleCustomColorChange}
            />
            <Label className="text-muted-foreground">Opacity</Label>
            <Slider
              min={0}
              max={1}
              step={0.01}
              onValueChange={([val]) => changeOpacity(val)}
              value={[getOpacity()]}
            />

            {PropId === 'background' && (
              <div className="my-4 flex justify-between">
                <Label className="text-muted-foreground">Gradient</Label>
                <Switch
                  checked={colorState.gradient}
                  onCheckedChange={() => {
                    colorDispatch({ type: 'SET_GRADIENT', payload: !colorState.gradient });
                  }}
                />
              </div>
            )}

            {PropId === 'background' && colorState.gradient && (
              <>
                <TooltipProvider>
                  <Label className="text-muted-foreground">Color</Label>
                  <Tabs
                    value={colorState.selectedColor === 1 ? '1' : '2'}
                    onValueChange={(val) => {
                      colorDispatch({ type: 'SET_SELECTED_COLOR', payload: Number(val) });
                    }}
                  >
                    <TabsList className="flex items-center flex-row justify-between border-[1px] rounded-md bg-transparent h-fit gap-2">
                      <Tooltip>
                        <TooltipTrigger>
                          <TabsTrigger className="w-10 h-9 p-0 data-[state=active]:bg-muted" value="1">
                            C1
                          </TabsTrigger>
                        </TooltipTrigger>
                        <TooltipContent>Color one</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger>
                          <TabsTrigger className="w-10 h-9 p-0 data-[state=active]:bg-muted" value="2">
                            C2
                          </TabsTrigger>
                        </TooltipTrigger>
                        <TooltipContent>Color two</TooltipContent>
                      </Tooltip>
                    </TabsList>
                  </Tabs>
                </TooltipProvider>

                <Label className="text-muted-foreground">Direction</Label>
                <TooltipProvider>
                  <Tabs
                    value={colorState.direction}
                    onValueChange={(val) => {
                      colorDispatch({ type: 'SET_DIRECTION', payload: val });
                    }}
                  >
                    <TabsList className="flex items-center flex-row justify-between border-[1px] rounded-md bg-transparent h-fit gap-2">
                      <Tooltip>
                        <TooltipTrigger>
                          <TabsTrigger className="w-10 h-10 p-0 data-[state=active]:bg-muted" value="to left">
                            <MoveLeft size={18} />
                          </TabsTrigger>
                        </TooltipTrigger>
                        <TooltipContent>To Left</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger>
                          <TabsTrigger className="w-10 h-10 p-0 data-[state=active]:bg-muted" value="to right">
                            <MoveRight size={18} />
                          </TabsTrigger>
                        </TooltipTrigger>
                        <TooltipContent>To Right</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger>
                          <TabsTrigger className="w-10 h-10 p-0 data-[state=active]:bg-muted" value="to top">
                            <MoveUp size={18} />
                          </TabsTrigger>
                        </TooltipTrigger>
                        <TooltipContent>To Top</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger>
                          <TabsTrigger className="w-10 h-10 p-0 data-[state=active]:bg-muted" value="to bottom">
                            <MoveDown size={18} />
                          </TabsTrigger>
                        </TooltipTrigger>
                        <TooltipContent>To Bottom</TooltipContent>
                      </Tooltip>
                    </TabsList>
                  </Tabs>
                </TooltipProvider>

                <div>
                  <Label className="text-muted-foreground">Image</Label>
                  <Input
                    placeholder="https://placeholder-image.com"
                    onChange={onImageChange}
                    value={colorState.image}
                  />
                </div>

                <Label className="text-muted-foreground">Background Size</Label>
                <TooltipProvider>
                  <Tabs
                    value={colorState.ImageSize}
                    onValueChange={(val) => {
                      colorDispatch({ type: 'SET_IMAGE_SIZE', payload: val });
                    }}
                  >
                    <TabsList className="flex items-center flex-row justify-between border-[1px] rounded-md bg-transparent h-fit gap-2">
                      <Tooltip>
                        <TooltipTrigger>
                          <TabsTrigger className="w-10 h-10 p-0 data-[state=active]:bg-muted" value="cover">
                            <ChevronsLeftRightIcon size={18} />
                          </TabsTrigger>
                        </TooltipTrigger>
                        <TooltipContent>Cover</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger>
                          <TabsTrigger className="w-10 h-10 p-0 data-[state=active]:bg-muted" value="contain">
                            <AlignVerticalJustifyCenter size={22} />
                          </TabsTrigger>
                        </TooltipTrigger>
                        <TooltipContent>Contain</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger>
                          <TabsTrigger className="w-10 h-10 p-0 data-[state=active]:bg-muted" value="center">
                            <AlignCenter size={18} />
                          </TabsTrigger>
                        </TooltipTrigger>
                        <TooltipContent>Center</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger>
                          <TabsTrigger className="w-10 h-10 p-0 data-[state=active]:bg-muted" value="auto">
                            <LucideImageDown size={18} />
                          </TabsTrigger>
                        </TooltipTrigger>
                        <TooltipContent>Auto</TooltipContent>
                      </Tooltip>
                    </TabsList>
                  </Tabs>
                </TooltipProvider>
              </>
            )}
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};

export default BackgroundColorPicker;