"use client";
import React from "react";

export default function Fallback({ error, resetErrorBoundary }) {
    return (
        <div className="p-2">
            <p>Something went wrong:</p>
            <p>{error.message}</p>
        </div>
    )
}
