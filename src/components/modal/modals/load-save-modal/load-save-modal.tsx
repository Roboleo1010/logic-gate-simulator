import Constants from '../../../../constants';
import Modal from '../../modal';
import NotificationManager, { NotificationType } from '../../../../manager/notification-manager';
import React, { Component } from 'react';
import './load-save-modal.scss';

interface LoadSaveModalProps {
    onLoadCallback: (blueprintData: string) => void;
    onCloseCallback: () => void;
    saveData: string;
}

class LoadSaveModal extends Component<LoadSaveModalProps>{
    onLoad() {
        let data = (document.getElementById("load") as HTMLInputElement).value;
        this.props.onLoadCallback(data);

        this.props.onCloseCallback();
    }

    onSave() {
        let savedataInput = (document.getElementById("save") as HTMLTextAreaElement);

        savedataInput.select();
        savedataInput.setSelectionRange(0, this.props.saveData.length + 1);

        document.execCommand("copy")
        NotificationManager.addNotification("Copied Savedata", " ", NotificationType.Success);

        localStorage.setItem(Constants.BlueprintSaveKey, savedataInput.value);
        this.props.onCloseCallback();
    }

    getSessionStorageSave(): string {
        //if no blueprints are created check local store
        if (localStorage.getItem(Constants.BlueprintSaveKey))
            return localStorage.getItem(Constants.BlueprintSaveKey)!;
        else
            return '';
    }

    render() {
        return (
            <Modal title="Load/ Save Blueprints" onClose={this.props.onCloseCallback}>
                <div className="load-save-wrapper">
                    <span id="description-load">To load your Blueprints paste your Savedata into the input field below and press the load button.</span>
                    <span id="description-save">To save your Blueprints copy your Savedata from the input field below or press the copy button. Save the copied data locally. Your savedata is also saved with the browser but it may get lost after some time or after clearing the cache.</span>

                    <textarea rows={15} name="load" id='load' defaultValue={this.getSessionStorageSave()} />
                    <textarea rows={15} name="save" id='save' value={this.props.saveData} readOnly />

                    <button onClick={this.onLoad.bind(this)} id='button-load'>Load</button>
                    <button onClick={this.onSave.bind(this)} id='button-save'>Save (Copy to clipboard)</button>
                </div>
            </Modal >
        );
    }
}

export default LoadSaveModal;