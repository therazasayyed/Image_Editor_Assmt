import React, { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import './CanvasEditor.css';

const CanvasEditor = ({ imageUrl }) => {
    const canvasRef = useRef(null);
    const fabricCanvasRef = useRef(null);
    const addTextRef = useRef(null);
    const addCircleRef = useRef(null);
    const addRectangleRef = useRef(null);
    const addTriangleRef = useRef(null);
    const downloadRef = useRef(null);

    useEffect(() => {
        // Dispose of any previous Fabric.js canvas instance
        if (fabricCanvasRef.current) {
            fabricCanvasRef.current.dispose();
        }

        // Initialize the Fabric.js canvas
        const canvasElement = canvasRef.current;
        if (!canvasElement) return;

        const canvas = new fabric.Canvas(canvasElement, {
            height: 500,
            width: 700,
        });
        fabricCanvasRef.current = canvas;

        // Set background image if imageUrl is provided
        if (imageUrl) {
            fabric.Image.fromURL(
                imageUrl,
                (img) => {
                    if (canvas && canvas.contextContainer) {
                        img.scaleToWidth(700);
                        img.set({
                            selectable: false,
                            evented: false,
                        });
                        canvas.setBackgroundImage(
                            img,
                            () => {
                                if (canvas.contextContainer) {
                                    canvas.renderAll();
                                }
                            },
                            {
                                scaleX: canvas.width / img.width,
                                scaleY: canvas.height / img.height,
                            }
                        );
                    }
                },
                { crossOrigin: 'anonymous' }
            );
        } else {
            canvas.setBackgroundImage(null, canvas.renderAll.bind(canvas));
        }

        // Function to add editable text to canvas
        const addText = () => {
            if (!canvas || !canvas.contextContainer) return;
            const text = new fabric.Textbox('Add your text here', {
                left: 50,
                top: 50,
                fill: 'black',
                fontSize: 20,
                editable: true,
                selectable: true,
                evented: true,
            });
            canvas.add(text);
            canvas.setActiveObject(text);
        };

        // Function to add different shapes
        const addShape = (type) => {
            if (!canvas || !canvas.contextContainer) return;
            let shape;
            switch (type) {
                case 'circle':
                    shape = new fabric.Circle({ radius: 50, fill: 'blue', left: 100, top: 100 });
                    break;
                case 'rectangle':
                    shape = new fabric.Rect({ width: 100, height: 60, fill: 'green', left: 100, top: 200 });
                    break;
                case 'triangle':
                    shape = new fabric.Triangle({ width: 100, height: 100, fill: 'yellow', left: 150, top: 300 });
                    break;
                default:
                    return;
            }
            canvas.add(shape);
        };

        // Bind button handlers
        addTextRef.current.onclick = addText;
        addCircleRef.current.onclick = () => addShape('circle');
        addRectangleRef.current.onclick = () => addShape('rectangle');
        addTriangleRef.current.onclick = () => addShape('triangle');

        // Download canvas as an image
        downloadRef.current.onclick = () => {
            if (!canvas || !canvas.contextContainer) return;
            const dataURL = canvas.toDataURL({
                format: 'png',
                quality: 1,
            });
            const link = document.createElement('a');
            link.href = dataURL;
            link.download = 'edited-image.png';
            link.click();
        };

        // Cleanup to dispose of the canvas when the component unmounts
        return () => {
            if (fabricCanvasRef.current) {
                fabricCanvasRef.current.dispose();
                fabricCanvasRef.current = null;
            }
        };
    }, [imageUrl]);

    return (
        <div className="canvas-editor">
            <canvas ref={canvasRef} />
            <div className="button-container">
                <button ref={addTextRef}>Add Text</button>
                <button ref={addCircleRef}>Add Circle</button>
                <button ref={addRectangleRef}>Add Rectangle</button>
                <button ref={addTriangleRef}>Add Triangle</button>
                <button ref={downloadRef}>Download</button>
            </div>
        </div>
    );
};

export default CanvasEditor;
