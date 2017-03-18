
import React from 'react'
import ReactDOM from 'react-dom'

class BaseChatComponent extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            input: '',
            showInput: 0,
            messages: [],
            historyPosition: 0,
            historyMessages: []
        }
    }

    componentWillMount() {
		window.insertMessageToChat = this._insertMessageToChat.bind(this)
        this._historyInputChatMessage = this._historyInputChatMessage.bind(this)
        document.addEventListener("keyup", this._handleKeyDown.bind(this));
	}

    _handleKeyDown(e) {
        
        if(e.keyCode == 84 && this.state.input == '') {
            this.setState({showInput: 1})
            mp.invoke("focus", true)
        }
        if(e.keyCode == 27 && this.state.showInput) {
            this.setState({showInput: 0, input: ''})
            mp.invoke("focus", false)
        }
        if(e.keyCode == 13 && this.state.input != '') {
            if(this.state.input.length > 0)
            {
                this._historyInputChatMessage(this.state.input)
                if(this.state.input[0] == "/")
                {
                    let value = this.state.input.substr(1);
                    if(value.length > 0)
                        mp.invoke("command", value);
                }
                else
                {
                    mp.invoke("chatMessage", this.state.input);
                }
            }
            mp.invoke("focus", false)
            this.setState({showInput: 0, input: ''})
        }
        else if(e.keyCode == 13 && this.state.showInput && this.state.input == '') {
            this.setState({showInput: 0, input: ''})
            mp.invoke("focus", false)
        }
        if(e.keyCode == 40 && this.state.showInput) {
            if (this.state.historyPosition > 0) {
                this.state.historyPosition -= 1;
                if (this.state.historyPosition == 0 && this.state.input != '') {
                    this.setState({input: ''})
                    return;
                }
                this.setState({input: this.state.historyMessages[this.state.historyMessages.length - this.state.historyPosition]})
            }
            
        }
        if(e.keyCode == 38 && this.state.showInput) {
            if (this.state.historyPosition < this.state.historyMessages.length) {
                this.state.historyPosition += 1;
                this.setState({input: this.state.historyMessages[this.state.historyMessages.length - this.state.historyPosition]})
            }
            
        }
    }

    _insertMessageToChat(str) {
        this.setState((prevState) => {
            return prevState.messages.push(str)
        });
        this.scrollToBottom();
        if (this.state.messages.length > 50)
            this.state.messages.splice(0, 1);
    }

    _historyInputChatMessage(str)
    {
        this.state.historyPosition = 0
        if (this.state.historyMessages.length === 0 || (this.state.historyMessages.length > 0 && this.state.historyMessages[this.state.historyMessages.length - 1] !== str))
            this.state.historyMessages.push(str);

        if (this.state.historyMessages.length > 50)
            this.state.historyMessages.splice(0, 1);

    }

    get isActiveInput(){
        return this.state.showInput ? 'block' : 'none'
    }

    handleInputChange(e) {
        this.setState({input: e.target.value})
    }

    scrollToBottom() {
        const scrollHeight = this.messageList.scrollHeight;
        const height = this.messageList.clientHeight;
        const maxScrollTop = scrollHeight - height;
        this.messageList.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }

    render() { 
        return (
            <div id = "chat" className = "ui_element" style = {{position: 'absolute'}}> 
                <ul id = "chat_messages" ref={(div) => {this.messageList = div}}>
                    {
                        this.state.messages.map((item, key) => {
                            return (
                                <li key = {key} dangerouslySetInnerHTML={{__html: item}}></li> 
                            )
                        })
                    }
                    
                </ul>
                <div><input id = "chat_msg" type = "text" ref = {input => input && input.focus()} value = {this.state.input} onChange = {this.handleInputChange.bind(this)} style = {{display: this.isActiveInput}} /></div>
            </div>
        )
    }
}

ReactDOM.render(<BaseChatComponent />, document.getElementById('content'));