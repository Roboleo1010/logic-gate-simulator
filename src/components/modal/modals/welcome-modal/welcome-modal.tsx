import chip from '../../../../assets/tutorial/chip.png';
import Modal from '../../modal';
import React, { Component } from 'react';
import './welcome-modal.scss';

interface WelcomeMoalProps {
    onCloseCallback: () => void;
}

class WelcomeMoal extends Component<WelcomeMoalProps> {

    render() {
        return (
            <Modal title="Welcome!" onClose={this.props.onCloseCallback}>
                <div className="welcome-wrapper">
                    <div id="welcome">
                        <span >If this is the first time using this logic gate simulator please consider reading this little intruduction.</span>
                        <br />
                        <span>If your are new to the concept of logic gates and boolean logic you may want to check out this YouTube Video: </span>
                        <a href="https://www.youtube.com/watch?v=gI-qXk7XojA" target="_blank" rel="noreferrer">Boolean Logic & Logic Gates by Crash Course Computer Science</a>
                    </div>
                    <div id="chips">
                        <h4>Chips</h4>
                        <span>A Chip contains one or more Logic Gates. Chips are displayed as colored rectangles with their name ontop (See below). On the Sides of the Chip are pins (connectors). These can be connected by wires.</span>
                        <br />
                        <span>You can add Chips by dragging them from the drawer at the bottom onto the board above.</span>
                        <br />
                        <span>An example of an <a href="https://en.wikipedia.org/wiki/NAND_gate" target="_blank" rel="noreferrer">NAND-Chip</a> (NOT AND). It has two inputs on the left and one output on the right side. Signals always flow from outputs to inputs.</span>
                    </div>
                    <img src={chip} id="chip" alt="of a Chip with Pins (Connectors) on the left & right side"></img>
                    <div id="toolbar">
                        <h4>Toolbar</h4>
                        <span>The Toolbar is on the fight side of the screen level with the chip categorys. These are the buttons functions:</span>
                        <br />
                        <b>Move: </b><span>If this tool is selected you can drag Chips arround the board.</span>
                        <br />
                        <b>Delete: </b><span>If this tool is selected you can delete Chips and Wires.</span>
                        <br />
                        <b>Rename: </b><span>If this tool is selected you can rename pins (connectors) by clicking on them.</span>
                        <br />
                        <b>Simulate: </b><span>This button toggles the Simulation. (Running or Paused)</span>
                        <br />
                        <b>Package Chip: </b><span>This button packages your creation into a chip you can reuse. All input-chips (Switches/ Clocks) will be converted into inputs. All output-chips will be converted into outputs.</span>
                        <br />
                        <b>Load/ Save: </b><span>This button opens a dialouge where you can import and export your custom Blueprints (created via Package Chip).</span>
                        <br />
                        <b>Help: </b><span>Opens this intruduction</span>
                        <br />
                        <b>Switch Theme: </b><span>This button toggles between a dark and a light theme.</span>
                    </div>
                    <span id="thanks">Thank you for using this simulator! Have fun!</span>
                    <button onClick={this.props.onCloseCallback} id='close'>Close</button>
                </div>
            </Modal >
        );
    }
}

export default WelcomeMoal;