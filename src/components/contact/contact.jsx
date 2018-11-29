import React, { Component } from 'react';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import { MAIN_BACKGROUND_IMAGE, APP_TITLE, MAIL_TO } from '../../utilities/constants';

import "./contact.scss";

const USER_DEFAULT_REQUIRED = 'Minimum 1 character required';
const USER_NAME_REQUIRED = 'Minimum 1 character required';
// const USER_EMAIL_ADDRESS_REQUIRED = 'Minimum 1 character required';
// const USER_EMAIL_ADDRESS_INVALID = 'Invalid email address';
const USER_COMMENTS_REQUIRED = 'Minimum 1 character required';

// const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

class Contact extends Component {

    constructor(props) {
        super(props);

        this.state = {
            formFields: {
                userName: '',
                // userEmailAddress: '',
                userComments: ''
            },
            formErrors: {
                userName: '',
                // userEmailAddress: '',
                userComments: ''
            },
            submitAttempted: false
        }

        console.log(this.state);
    }

    // handleChangeContactFields = (field) => (e) => {

    handleChange = e => {
        const {name, value} = e.target;
        const {formFields, formErrors} = this.state;

        switch (name) {
            case "userName":
                // if (value.length < 1) this.setState({formErrors: {userName: "Minimum 1 character required"}}, () => console.log(this.state));
                formErrors.userName = value.length < 1 ? USER_NAME_REQUIRED : "";
                break;
            // case "userEmailAddress":
            //     formErrors.userEmailAddress = value.length < 1 ? USER_EMAIL_ADDRESS_REQUIRED : "";
            //     formErrors.userEmailAddress = value.length > 0 && !EMAIL_REGEX.test(value) ? USER_EMAIL_ADDRESS_INVALID : formErrors.userEmailAddress
            //     break;
            case "userComments":
                formErrors.userComments = value.length < 1 ? USER_COMMENTS_REQUIRED : "";
                break;
            default:
                break;
        }

        this.setState({ formFields: Object.assign(formFields, {[name]: value })});
        this.setState({ formErrors }, () => console.log(this.state));
    }

    handleSubmit = (e) => {

        e.preventDefault();

        const {formFields, formErrors} = this.state;

        this.setState({ submitAttempted: true });

        Object.keys(formFields).forEach(key => {
            if (formFields[key].trim() === '') {
                this.setState({ formErrors: Object.assign(formErrors, {[key]: USER_DEFAULT_REQUIRED})})
            }
        });

        if (this.formValid()) {

            // window.location.href = `mailto:${formFields.userEmailAddress}?subject=Test?body=Test2`

            window.open(`
            mailto:${MAIL_TO}
            ?subject=${APP_TITLE} - ${formFields.userName}
            &body=${encodeURIComponent(formFields.userComments)}
            `
            , '_blank');

            // Clear the form
            this.setState({ formFields: Object.assign(formFields, {userName: '', userComments: '' })});         
            this.setState({ formErrors: Object.assign(formErrors, {userName: '', userComments: '' })});
            this.setState({ submitAttempted: false });

            console.log(`
                -- SUBMITTING --
                Name: ${formFields.userName}
                Email: ${formFields.userEmailAddress}
                Comments: ${formFields.userComments}
            `);
        } else {
            console.log("FORM INVALID");
        }
    }

        formValid = () => {
            let isValid = true;

            const {formFields, formErrors} = this.state;
            
            Object.values(formErrors).forEach(val => { val.length > 0 && (isValid = false) });          // Validate form errors being empty
            
            Object.values(formFields).forEach(val => { val.trim() === '' && (isValid = false) });       // Validate the form fields contained values

        return isValid;
    }

    render() {

        // const {formFields: {userName, userEmailAddress, userComments}, formErrors, submitAttempted} = this.state;
        const {formFields: {userName, userComments}, formErrors, submitAttempted} = this.state;

        return (
            <div className="container-main-content-contact">
            <img className="full-screen-background-image" src={MAIN_BACKGROUND_IMAGE} alt=""></img>
                <div className="container-card">
                    <header>
                        <h1>Contact</h1>
                        <p>If you have any comments about this application, please complete the details below:</p>
                        <p>(This will create a new email in your default email application)</p>
                    </header>

                    <div className="contact">
                        <div className="main-form">
                            <form className="contact-form">

                                <div className="contact-form-full-width">
                                    <TextField
                                        type="text"
                                        id="userName"
                                        name="userName"
                                        label="Your Name"
                                        className="form-control"
                                        required={true}
                                        fullWidth={true}
                                        value={userName}
                                        onChange={this.handleChange}
                                    />
                                </div>
                                {submitAttempted && formErrors.userName.length > 0 ? <div className="errorMessage">{formErrors.userName}</div> : <div>&nbsp;</div>}

                                {/* <div className="contact-form-full-width">
                                    <TextField
                                        type="text"
                                        id="userEmailAddress"
                                        name="userEmailAddress"
                                        label="Your email address"
                                        className="form-control"
                                        required={true}
                                        fullWidth={true}
                                        value={userEmailAddress}                                            
                                        onChange={this.handleChange}
                                    />
                                </div>
                                {submitAttempted && formErrors.userEmailAddress.length > 0 ? <div className="errorMessage">{formErrors.userEmailAddress}</div> : <div>&nbsp;</div>} */}

                                <div className="contact-form-full-width">
                                    <TextField
                                        type="text"
                                        id="userComments"
                                        name="userComments"
                                        label="Your comments"
                                        className="form-control"
                                        required={true}
                                        multiline={true}
                                        rows="7"
                                        fullWidth={true}
                                        value={userComments}
                                        onChange={this.handleChange}
                                    />        
                                </div>
                                {submitAttempted && formErrors.userComments.length > 0 ? <div className="errorMessage">{formErrors.userComments}</div> : <div>&nbsp;</div>}

                            </form>

                            <div className="submit-button">
                                <Button variant="contained" color="primary" id="submit" onClick={this.handleSubmit}>Submit</Button>
                            </div>

                            { submitAttempted && !this.formValid() &&
                                <div className="invalid-form-message">
                                    <p>Invalid ... please check the details highlighted in red above</p>
                                </div>
                            }

                            {/* <div>
                                <p>Form Value: {{ contactForm.value | json }}</p>
                                <p>Form Status: {{ contactForm.status | json }}</p>
                                <p>Errors: {{ contactForm.controls.name?.errors | json }}</p>
                                <p>Errors: {{ contactForm.controls.emailAddress?.errors | json }}</p>
                                <p>Errors: {{ contactForm.get('emailAddress').errors | json }}</p>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        );
    };
};

export default Contact;