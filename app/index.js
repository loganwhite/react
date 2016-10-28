import React from 'react'
import ReactDOM from 'react-dom'
import $ from 'jquery'
import 'jquery'

var g_btns = [
    {id:1,text:"新咨询",link:"http://www.baidu.com"},
    {id:2,text:"只看此用户",link:"http://www.baidu.com"}
];

class ConsultDetail extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {

		return (
			<div className="container">
				<Header user="aaa" column="bbb" function="ccc" />
				<ToolBar btn={g_btns}  />
				<Content consultId={this.props.consultId} consultUrl={this.props.consultUrl} />
			</div>
		);
	}
}

class Header extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="header" >
				{this.props.user} >> {this.props.column} >> {this.props.function}
			</div>
		);
	}
}

class ToolBar extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		let btns = this.props.btn.map(button => (
			<Button text={button.text} link={button.link} key={button.id} />
		));
		return (
			<div className="toolbar">
				{btns}
			</div>
		);
	}
}

class Button extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<a className="btn" href={this.props.link} >{this.props.text}</a>
		);
	}
}

class Content extends React.Component {
	constructor(props) {
		super(props);
		this.state = {data:[]};
	}

	componentWillMount() {

		$.ajax({
			url:this.props.consultUrl,
			method:'get',
			data:{'id':this.props.consultId},
			success:function(resData) {
				
				this.setState({data:resData});
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});

	}

	render() {
		let item = this.state.data.map(i => (
			<ContentItem user={i.username} userpage={i.userpage} content={i.content} key={i.id} />
		));

		return (
			<div className="container">
				{item}
			</div>
		);
	}
}

class ContentItem extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return(
			<div className="item">
				<div className="user-info">
					<div>{this.props.user}</div>
					<div><a href={this.props.userpage} >查看用户</a></div>
				</div>
				<div className="content">
					{this.props.content}
				</div>
			</div>
		);
	}
}

var id = $("#consult-id").val();

ReactDOM.render(<ConsultDetail consultId={id} consultUrl="/comments.json" />, document.getElementById('app'))