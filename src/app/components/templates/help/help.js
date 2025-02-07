"use client"
import React from "react";
import Title from "app/components/atoms/title/title";

export default function Help(props) {  
  const { className } = props;
  return (
    <div className={className}>
      <div className="w-[12rem]">
        <Title
          Icon={() => <i className="fa-solid fa-keyboard mr-2" />}
          label="Keyboard Shortcuts"
          labelClassName="font-semibold text-sm"
        />
      </div>
      <div className="ml-1 mt-2">
        <div className="text-xs"><span className="font-semibold">Increment Date:</span> Shift + Right Arrow</div>
        <div className="text-xs"><span className="font-semibold">Decrement Date:</span> Shift + Left Arrow</div>
        <div className="text-xs"><span className="font-semibold">Switch View:</span> Shift + Up Arrow/Down Arrow</div>
        <div className="text-xs"><span className="font-semibold">Force Refresh:</span> Alt + r</div>
        <div className="text-xs"><span className="font-semibold">Open/Close Sidebar:</span> Alt + s</div>
      </div>
    </div>
  )
}
