import React, { Component } from 'react';
import { Vector2 } from '../../model/circuit-builder.types';

interface DraggableProps {
    enabled: boolean;
    className?: string;
    classNameDisabled?: string;
    classNameEnabled?: string;
    classNameDragging?: string;
    confine: 'parent' | 'fullscreen' | string;
    startPosition?: Vector2;
    onDragStart?: () => void;
    onDrag?: (translation: Vector2) => void;
    onDragEnd?: () => void;
}

interface DraggableState {
    translation: Vector2; //distance from origin
    initial: Vector2;

    isDragged: boolean;
    draggableRef: any;
}

class Draggable extends Component<DraggableProps, DraggableState>{
    constructor(props: DraggableProps) {
        super(props);

        let startPos = { x: 0, y: 0 };

        if (this.props.startPosition !== undefined)
            startPos = this.props.startPosition;

        this.state = { translation: startPos, isDragged: false, initial: startPos, draggableRef: React.createRef() };
    }

    componentDidMount() {
        this.state.draggableRef.current.addEventListener('touchstart', this.dragStart.bind(this), { passive: false });
        this.state.draggableRef.current.addEventListener('touchmove', this.drag.bind(this), { passive: false });
        this.state.draggableRef.current.addEventListener('touchend', this.dragEnd.bind(this), { passive: false });
    }

    componentWillUnmount() {
        this.state.draggableRef.current.removeEventListener('touchstart', this.dragStart.bind(this),);
        this.state.draggableRef.current.removeEventListener('touchmove', this.drag.bind(this));
        this.state.draggableRef.current.removeEventListener('touchend', this.dragEnd.bind(this));
    }

    dragStart(e: any) {
        if (!this.props.enabled)
            return;

        e.preventDefault();

        let clientPos: Vector2;

        if (e.type === "touchstart")
            clientPos = { x: e.touches[0].clientX, y: e.touches[0].clientY }
        else
            clientPos = { x: e.clientX, y: e.clientY };

        this.setState({ initial: { x: clientPos.x - this.state.translation.x, y: clientPos.y - this.state.translation.y }, isDragged: true });

        if (this.props.onDragStart)
            this.props.onDragStart();
    }

    drag(e: any) {
        if (!this.state.isDragged)
            return;

        e.preventDefault();

        let clientPos: Vector2;

        if (e.type === "touchmove")
            clientPos = { x: e.touches[0].clientX, y: e.touches[0].clientY }
        else
            clientPos = { x: e.clientX, y: e.clientY };

        let translation = { x: clientPos.x - this.state.initial.x, y: clientPos.y - this.state.initial.y };

        const dragggableRect: DOMRect = this.state.draggableRef.current.getBoundingClientRect();

        if (this.props.confine === 'fullscreen') {
            if (translation.x > 0) //top
                translation.x = 0;

            if (translation.y > 0) //left
                translation.y = 0;

            if (translation.x < -dragggableRect.width + document.body.clientWidth) //right
                translation.x = -dragggableRect.width + document.body.clientWidth;

            if (translation.y < -dragggableRect.height + document.body.clientHeight) //bottom
                translation.y = -dragggableRect.height + document.body.clientHeight;
        }
        else {
            let confineRect: DOMRect;

            if (this.props.confine === 'parent')
                confineRect = this.state.draggableRef.current.parentElement.getBoundingClientRect();
            else if (document.getElementById(this.props.confine))
                confineRect = document.getElementById(this.props.confine)!.getBoundingClientRect();
            else {
                console.error("No element with id " + this.props.confine + " can be found");
                return;
            }

            //check bounds
            if (translation.y < confineRect.top) {
                translation.y = confineRect.top;
                console.error("top");

            }

            if (translation.y > confineRect.bottom - dragggableRect.height) {
                translation.y = confineRect.bottom - dragggableRect.height;
                console.error("bottom");
            }

            if (translation.x < confineRect.left) {
                translation.x = confineRect.left;
                console.error("left");

            }

            if (translation.x > confineRect.right - dragggableRect.width) {
                translation.x = confineRect.right - dragggableRect.width;
                console.error("right");
            }
        }

        this.setState({ translation: translation });

        if (this.props.onDrag)
            this.props.onDrag(translation);
    }

    dragEnd(e: any) {
        this.setState({ initial: { x: this.state.translation.x, y: this.state.translation.y }, isDragged: false });


        if (this.props.onDragEnd)
            this.props.onDragEnd();
    }

    render() {
        const style = { transform: `translate(${this.state.translation.x}px, ${this.state.translation.y}px)`, display: 'inline-block' };

        let className = '';

        if (this.props.className)
            className = this.props.className;

        if (this.props.enabled && this.props.classNameEnabled)
            className += " " + this.props.classNameEnabled;
        else if (!this.props.enabled && this.props.classNameDisabled)
            className += " " + this.props.classNameDisabled;

        if (this.state.isDragged)
            className += " " + this.props.classNameDragging;


        return (
            <div ref={this.state.draggableRef} style={style} className={className} draggable={this.props.enabled} onMouseDown={(e) => this.dragStart(e)} onMouseMove={(e) => this.drag(e)} onMouseUp={(e) => this.dragEnd(e)} >
                { this.props.children}
            </div >);
    }
}

export default Draggable;