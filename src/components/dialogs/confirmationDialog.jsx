import React from 'react';
import Button from "@material-ui/core/Button";

import Dialog from '@material-ui/core/Dialog';
// import DialogTitle from '@material-ui/core/DialogTitle';

import './confirmationDialog.css';

class ConfirmationDialog extends React.Component {

    handleClose = () => {
      this.props.onClose();
    };
       
    render() {
      const { message, onClose, ...other } = this.props;
  
      return (
        <Dialog onClose={this.handleClose} aria-labelledby="simple-dialog-title" {...other}>
          {/* <DialogTitle class="dialog-title">Save</DialogTitle> */}
          <div>
            <p className="dialog-para">{message}</p>
          </div>
          <div className="dialog-button">
            <Button variant="contained" color="primary" id="dialogConfirm" onClick={this.handleClose}>OK</Button>
          </div>
        </Dialog>
      );
    }
  }
      
  export default ConfirmationDialog;