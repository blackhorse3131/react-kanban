import React, { useState } from 'react'
import styled from 'styled-components'
import { DragDropContext } from 'react-beautiful-dnd'
import Lane from './components/Lane'
import reorderBoard from './services/reorderBoard'
import withDroppable from '../withDroppable'

const StyledBoard = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  padding: 5px;
  overflow-y: hidden;
`

const DroppableBoard = withDroppable(StyledBoard)

function Board ({ children, onCardDragEnd, onLaneDragEnd }) {
  const [board, setBoard] = useState(children)

  function onDragEnd (event) {
    if (event.destination === null) return

    let source = { index: event.source.index }
    let destination = { index: event.destination.index }
    let propCallback = onLaneDragEnd

    if (event.type !== 'BOARD') {
      source = { ...source, laneId: parseInt(event.source.droppableId) }
      destination = { ...destination, laneId: parseInt(event.destination.droppableId) }
      propCallback = onCardDragEnd
    }

    const reorderedBoard = reorderBoard(board, source, destination)
    propCallback && propCallback(reorderedBoard, source, destination)
    setBoard(reorderedBoard)
  }

  return (
    <DragDropContext
      onDragEnd={onDragEnd}
    >
      <DroppableBoard droppableId='board-droppable' direction='horizontal' type='BOARD'>
        {board.lanes.map((lane, idx) => (<Lane key={lane.id} index={idx}>{lane}</Lane>))}
      </DroppableBoard>
    </DragDropContext>
  )
}

export default Board
