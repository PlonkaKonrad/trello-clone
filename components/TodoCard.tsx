"use client";
import getUrl from "@/lib/getUrl";
import useBoardStore from "@/store/boardStore";
import { XCircleIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  DraggableProvidedDragHandleProps,
  DraggableProvidedDraggableProps,
} from "react-beautiful-dnd";

type Props = {
  todo: Todo;
  index: number;
  id: TypedColumn;
  innerRef: (element: HTMLElement | null) => void;
  draggableProps: DraggableProvidedDraggableProps;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
};

function TodoCard({
  todo,
  index,
  id,
  innerRef,
  dragHandleProps,
  draggableProps,
}: Props) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { deleteTask } = useBoardStore();

  useEffect(() => {
    if (todo.image) {
      const fetchImage = async () => {
        const url = await getUrl(todo.image!);
        setImageUrl(url.toString());
      };

      fetchImage();
    }
  }, [todo]);

  const removeTask = () => {
    deleteTask(index, todo, todo.status);
  };

  return (
    <div
      {...dragHandleProps}
      {...draggableProps}
      ref={innerRef}
      className="bg-white rounded-md space-y-2 drop-shadow-md "
    >
      <div className="flex justify-between items-center p-5">
        <p>{todo.title}</p>
        <button onClick={removeTask}>
          <XCircleIcon className="ml-5 h-8 w-8 text-red-500 hover:text-red-600" />
        </button>
      </div>

      {/* add image here */}

      {imageUrl && (
        <div className="relative h-full w-full rounded-b-md">
          <Image
            src={imageUrl}
            alt="Task image"
            width={400}
            height={200}
            className="w-full object-contain rounded-b-md"
          />
        </div>
      )}
    </div>
  );
}

export default TodoCard;
