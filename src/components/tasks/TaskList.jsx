import PropTypes from 'prop-types'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { TaskCard } from './TaskCard.jsx'

export function TaskList({ tasks, onToggle, onDelete, onEdit, onReorder, today, selectMode, selectedIds, onToggleSelect }) {
  const handleDragEnd = (result) => {
    if (!result.destination) return
    onReorder(result.source.index, result.destination.index)
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400">
        <p className="text-3xl mb-2">✅</p>
        <p className="text-sm">No tasks here. Add one above!</p>
      </div>
    )
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="tasks">
        {(provided) => (
          <ul
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-2"
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                {(provided, snapshot) => (
                  <li
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={snapshot.isDragging ? 'opacity-80 shadow-lg' : ''}
                  >
                    <TaskCard
                      task={task}
                      onToggle={onToggle}
                      onDelete={onDelete}
                      onEdit={onEdit}
                      today={today}
                      selectMode={selectMode}
                      isSelected={selectedIds?.has(task.id) ?? false}
                      onToggleSelect={onToggleSelect}
                    />
                  </li>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  )
}

TaskList.propTypes = {
  tasks: PropTypes.array.isRequired,
  onToggle: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onReorder: PropTypes.func.isRequired,
  today: PropTypes.string.isRequired,
  selectMode: PropTypes.bool,
  selectedIds: PropTypes.instanceOf(Set),
  onToggleSelect: PropTypes.func,
}
