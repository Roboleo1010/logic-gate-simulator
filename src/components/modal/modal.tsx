import Icons from '../../assets/icons/icons';
import React, { Component } from 'react';
import './modal.scss';

interface ModalProps {
    title: string;
    onClose: () => void;
}

class Modal extends Component<ModalProps> {
    render() {
        return (
            <div>
                <div className="modal-background"></div>
                <div className="modal">
                    <div className="modal-header">
                        <h3 className="title">{this.props.title}</h3>
                        <div className="close" style={{ backgroundImage: `url('${Icons.backgroundImage}${Icons.iconClose}')` }} title="Close" onClick={this.props.onClose}></div>
                    </div>
                    <div className="modal-body">
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}

export default Modal;