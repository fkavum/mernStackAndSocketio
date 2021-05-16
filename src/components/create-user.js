import React, {Component} from 'react';
import axios from 'axios';
export default class CreateUser extends Component {

    constructor(props) {
        super(props);
    
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    
        this.state = {
          username: '',
          password: '',
          email: '',
        }
    }

    onChangeUsername(e) {
        window.localStorage.setItem('name', e.target.value);
        this.setState({
            username: e.target.value
        })
    }

    onChangePassword(e) {
        this.setState({
            password: e.target.value
        })
    }

    onChangeEmail(e) {
        this.setState({
            email: e.target.value
        })
    }

    onSubmit(e) {
        e.preventDefault();

        const user = {
            username: this.state.username,
            password: this.state.password,
            email: this.state.email
        }

        axios.post('http://localhost:5000/users/add', user)
            .then(res => console.log(res.data))
            .catch(err => console.log(err));
            

        this.setState({
            username: ''
        })
    }
    
    render() {
        return (
            <div>
            <h3>Create New User</h3>
            <form onSubmit={this.onSubmit}>
                <div className="form-group"> 
                <label>Username: </label>
                <input  type="text"
                    required
                    className="form-control"
                    value={this.state.username}
                    onChange={this.onChangeUsername}
                    />
                <label>Sifre: </label>
                <input  type="password"
                    required
                    className="form-control"
                    value={this.state.password}
                    onChange={this.onChangePassword}
                    />
                <label>E-Mail: </label>
                <input  type="email"
                    required
                    className="form-control"
                    value={this.state.email}
                    onChange={this.onChangeEmail}
                />
                </div>
                <div className="form-group">
                <input type="submit" value="Create User" className="btn btn-primary" />
                </div>
            </form>
            </div>
        )
    }
}
