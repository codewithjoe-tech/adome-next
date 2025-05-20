
"use client"
import { EditorBtns } from "@/constants"
import React, { createContext, Dispatch, useContext, useEffect, useReducer } from "react"
import { EditorAction } from "./editor-action"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import axiosInstance from "@/axios/public-instance"
import { useSelector } from "react-redux"
import { RootState } from "@/Redux/store"
import { v4 } from "uuid"

export type DeviceTypes = 'Desktop' | 'Mobile' | 'Tablet'


export type EditorElement = {
    id: string
    styles: React.CSSProperties
    name: string
    type: EditorBtns
    content: EditorElement[] | { href?: string, innerText?: string, src?: string }
}


export type Editor = {
    liveMode: boolean
    elements: EditorElement[]
    selectedElement: EditorElement
    device: DeviceTypes
    previewMode: boolean
    webPageId: string
}


export type HistoryState = {
    history: Editor[]
    currentIndex: number
}


export type EditorState = {
    editor: Editor
    history: HistoryState
}



const initialEditorState: EditorState['editor'] = {
    elements: [
        {
            content: [
                {
                    content: {

                    },
                    id: v4(),
                    name: 'navbar',
                    styles: {

                    },
                    type: 'navbar',
                }
            ],
            id: '__body',
            name: 'Body',
            styles: {

                // paddingBottom: '600px',
                // padding: initialEditorState.liveMode && 0,
                // margin: 0
            },
            type: '__body',
        },
    ],
    selectedElement: {
        id: '',
        content: [],
        name: '',
        styles: {},
        type: null,
    },
    device: 'Desktop',
    previewMode: false,
    liveMode: false,
    webPageId: '',
}

const initialHistoryState: HistoryState = {
    history: [initialEditorState],
    currentIndex: 0,
}

const initialState: EditorState = {
    editor: initialEditorState,
    history: initialHistoryState,
}



const addAnElement = (
    editorArray: EditorElement[],
    action: EditorAction
): EditorElement[] => {
    if (action.type !== 'ADD_ELEMENT')
        throw Error(
            'You sent the wrong action type to the Add Element editor State'
        )
    return editorArray.map((item) => {
        if (item.id === action.payload.containerId && Array.isArray(item.content)) {
            return {
                ...item,
                content: [...item.content, action.payload.elementDetails],
            }
        } else if (item.content && Array.isArray(item.content)) {
            return {
                ...item,
                content: addAnElement(item.content, action),
            }
        }
        return item
    })
}


const deleteAnElement = (
    editorArray: EditorElement[],
    action: EditorAction
): EditorElement[] => {
    if (action.type !== 'DELETE_ELEMENT')
        throw Error(
            'You sent the wrong action type to the Delete Element editor State'
        )
    return editorArray.filter((item) => {
        if (item.id === action.payload.elementDetails.id) {
            return false
        } else if (item.content && Array.isArray(item.content)) {
            item.content = deleteAnElement(item.content, action)
        }
        return true
    })
}


const updateAnElement = (
    editorArray: EditorElement[],
    action: EditorAction
): EditorElement[] => {
    if (action.type !== 'UPDATE_ELEMENT') {
        throw Error('You sent the wrong action type to the update Element State')
    }
    return editorArray.map((item) => {
        if (item.id === action.payload.elementDetails.id) {
            return { ...item, ...action.payload.elementDetails }
        } else if (item.content && Array.isArray(item.content)) {
            return {
                ...item,
                content: updateAnElement(item.content, action),
            }
        }
        return item
    })
}


const editorReducer = (state: EditorState = initialState, action: EditorAction): EditorState => {
    switch (action.type) {
        case "ADD_ELEMENT":
            const updatedEditorState = {
                ...state.editor,
                elements: addAnElement(state.editor.elements, action),
                selectedElement: action.payload.elementDetails,
            }
            const updatedHistory = [
                ...state.history.history.slice(0, state.history.currentIndex + 1),
                { ...updatedEditorState },
            ]

            const newEditorState = {
                ...state,
                editor: updatedEditorState,
                history: {
                    ...state.history,
                    history: updatedHistory,
                    currentIndex: updatedHistory.length - 1,
                },
            }

            return newEditorState

        case "UPDATE_ELEMENT":
            const updatedElements = updateAnElement(state.editor.elements, action)

            const UpdatedElementIsSelected =
                state.editor.selectedElement.id === action.payload.elementDetails.id

            const updatedEditorStateWithUpdate = {
                ...state.editor,
                elements: updatedElements,
                selectedElement: UpdatedElementIsSelected
                    ? action.payload.elementDetails
                    : {
                        id: '',
                        content: [],
                        name: '',
                        styles: {},
                        type: null,
                    },
            }

            const updatedHistoryWithUpdate = [
                ...state.history.history.slice(0, state.history.currentIndex + 1),
                { ...updatedEditorStateWithUpdate }, // Save a copy of the updated state
            ]
            const updatedEditor = {
                ...state,
                editor: updatedEditorStateWithUpdate,
                history: {
                    ...state.history,
                    history: updatedHistoryWithUpdate,
                    currentIndex: updatedHistoryWithUpdate.length - 1,
                },
            }
            return updatedEditor

        case "DELETE_ELEMENT":

            const updatedElementsAfterDelete = deleteAnElement(
                state.editor.elements,
                action
            )
            const updatedEditorStateAfterDelete = {
                ...state.editor,
                elements: updatedElementsAfterDelete,
            }
            const updatedHistoryAfterDelete = [
                ...state.history.history.slice(0, state.history.currentIndex + 1),
                { ...updatedEditorStateAfterDelete },
            ]

            const deletedState = {
                ...state,
                editor: updatedEditorStateAfterDelete,
                history: {
                    ...state.history,
                    history: updatedHistoryAfterDelete,
                    currentIndex: updatedHistoryAfterDelete.length - 1,
                },
            }
            return deletedState
        case "CHANGE_CLICKED_ELEMENT":
            const clickedState = {
                ...state,
                editor: {
                    ...state.editor,
                    selectedElement: action.payload.elementDetails || {
                        id: '',
                        content: [],
                        name: '',
                        styles: {},
                        type: null,
                    },
                },
                history: {
                    ...state.history,
                    history: [
                        ...state.history.history.slice(0, state.history.currentIndex + 1),
                        { ...state.editor },
                    ],
                    currentIndex: state.history.currentIndex + 1,
                },
            }
            return clickedState
        case "CHANGE_DEVICE":
            const changedDeviceState = {
                ...state,
                editor: {
                    ...state.editor,
                    device: action.payload.device,
                },
            }
            return changedDeviceState

        case "TOGGLE_PREVIEW_MODE":
            return {
                ...state,
                editor: {
                    ...state.editor,
                    previewMode: !state.editor.previewMode,
                    elements: state.editor.elements.map((element) =>
                        element.id === "__body"
                            ? {
                                ...element,
                                styles: {
                                    ...element.styles,
                                    padding: !state.editor.previewMode ? 0 : undefined,
                                    paddingBottom: state.editor.previewMode ? "600px" : undefined
                                },
                            }
                            : element
                    ),
                },
            };


        case "TOGGLE_LIVE_MODE": {
            const newLiveMode = action.payload
                ? action.payload.value
                : !state.editor.liveMode;

            return {
                ...state,
                editor: {
                    ...state.editor,
                    liveMode: newLiveMode,
                    elements: state.editor.elements.map((element) =>
                        element.id === "__body"
                            ? {
                                ...element,
                                styles: {
                                    ...element.styles,
                                    padding: newLiveMode ? 0 : '5px',
                                },
                            }
                            : element
                    ),
                },
            };
        }


        case "REDO":
            if (state.history.currentIndex < state.history.history.length - 1) {
                const nextIndex = state.history.currentIndex + 1
                const nextEditorState = { ...state.history.history[nextIndex] }
                const redoState = {
                    ...state,
                    editor: nextEditorState,
                    history: {
                        ...state.history,
                        currentIndex: nextIndex,
                    },
                }
                return redoState
            }
            return state
        case "UNDO":
            if (state.history.currentIndex > 0) {
                const prevIndex = state.history.currentIndex - 1
                const prevEditorState = { ...state.history.history[prevIndex] }
                const undoState = {
                    ...state,
                    editor: prevEditorState,
                    history: {
                        ...state.history,
                        currentIndex: prevIndex,
                    },
                }
                return undoState
            }
            return state
        case "LOAD_DATA":
            return {
                ...initialState,
                editor: {
                    ...initialState.editor,
                    elements: action.payload.elements || initialEditorState.elements,
                    liveMode: !!action.payload.withLive,
                },
            }
        case "SET_FUNNELPAGE_ID":
            const { funnelPageId } = action.payload
            const updatedEditorStateWithFunnelPageId = {
                ...state.editor,
                funnelPageId,
            }

            const updatedHistoryWithFunnelPageId = [
                ...state.history.history.slice(0, state.history.currentIndex + 1),
                { ...updatedEditorStateWithFunnelPageId },
            ]

            const funnelPageIdState = {
                ...state,
                editor: updatedEditorStateWithFunnelPageId,
                history: {
                    ...state.history,
                    history: updatedHistoryWithFunnelPageId,
                    currentIndex: updatedHistoryWithFunnelPageId.length - 1,
                },
            }
            return funnelPageIdState
        default:
            return state
    }
}



export type EditorContext = {
    device: DeviceTypes
    preview: boolean
    setPreviewMode: (previewMode: boolean) => void
    setDevice: (device: DeviceTypes) => void
}



export const EditorContext = createContext<{
    state: EditorState
    dispatch: Dispatch<EditorAction>
    // subaccountId: string
    webId: string
    pageDetails: any | null
}>({
    state: initialState,
    dispatch: () => undefined,
    // subaccountId: '',
    webId: '',
    pageDetails: null,
})


type EditorProps = {
    children: React.ReactNode
    webId: string
    pageDetails: any | null

}



const EditorProvider = (props: EditorProps) => {
    const [state, dispatch] = useReducer(editorReducer, initialState)


    return (
        <EditorContext.Provider
            value={{
                state,
                dispatch,
                webId: props.webId,
                pageDetails: props.pageDetails,
            }}
        >
            {props.children}
        </EditorContext.Provider>
    )
}

export const useEditor = () => {
    const context = useContext(EditorContext)
    if (!context) {
        throw new Error('useEditor Hook must be used within the editor Provider')
    }
    return context
}

export default EditorProvider