
import { EditorElement } from '@/providers/editor/editor-provider'
import React from 'react'
import TextComponent from './text'
import Container from './container'
import VideoContainer from './video'
import TwoColumns from './two-column-container'
import LinkComponent from './link'
import Navbar from './navbar'

type Props = {
  element: EditorElement
}

const Recursive = ({ element }: Props) => {

  switch (element.type) {
    case "text":
      return <TextComponent element={element} />
    case "__body":
      return <Container element={element} />
    case 'container':
      return <Container element={element} />
    case 'video':
      return <VideoContainer element={element} />
    case '2Col':
      return <TwoColumns element={element} />
    case 'link':
      return <LinkComponent element={element} />
    case 'navbar':
      return <Navbar element={element} />



    default: return null

  }
}

export default Recursive