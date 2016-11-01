import React from 'react'
import ReactDOM from 'react-dom'
//import $ from 'jquery'

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
			<ContentItem user={i.username} 
			userpage={i.userpage} 
			content={i.content} 
			key={i.id} 
			id={i.id}
			photos={i.photos}
			type={i.type}
			asker={i.asker}
			date={i.date}
			question={i.question}
			reply={i.reply} />
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
					<div className="question-detail">
					<PictureViewer photos={this.props.photos}/>
					<Details theme={this.props.theme} 
						type={this.props.type} 
						asker={this.props.asker} 
						date={this.props.date}
						question={this.props.question} />
					</div>
					<div>
						<Reply reply={this.props.reply} id={this.props.id} />
					</div>
				</div>
			</div>
		);
	}
}


class PictureViewer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {data:{
			image:this.props.photos[0].image,
			intro:this.props.photos[0].intro
		}};
	}

	handleClick(e) {
		e.preventDefault();
		this.setState({data:{
			image:e.target.getAttribute('src'),
			intro:e.target.getAttribute('alt')
		}});
	}

	componentDidMount() {
		$(this.refs.zoom).zoom();
		let $scrollable = $(this.refs.scrollable);
		$scrollable.scrollable();
		$scrollable.hover(function() {
				var $this = $(this);
				if ($this.hasClass("current")) {
					return false;
				} else {
					$thumbnail.removeClass("current");
					$this.addClass("current").click();
				}
			});		
	}

	componentDidUpdate() {
		$(this.refs.zoom).trigger('zoom.destroy');
		$(this.refs.zoom).zoom();
	}

	render() {
		var images = this.props.photos.map(picture => (
			<a className="current" href="javascript:;" key={picture.image} >
				<img src={picture.image} alt={picture.intro} key={picture.image} onClick={this.handleClick.bind(this)} />
			</a>
		));

		return (

			<div className="container picture-view">
				<div className="zoom" ref="zoom">
					<img src={this.state.data.image} width='100%' height='320' alt={this.state.data.intro}/>
				</div>
				<a href="javascript:;" className="prev"></a>
				<div className="scrollable" id="scrollable" ref="scrollable">
					<div className="scrollitems">{images}</div>
				</div>
				<a href="javascript:;" className="next"></a>
			</div>
		);
	}
}

class Details extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="container details">
				<div>
					<table>
						<tbody>
							<tr><td>主题：{this.props.theme}</td><td>类型：{this.props.type}</td></tr>
							<tr><td>咨询者：{this.props.asker}</td><td>咨询日期：{this.props.date}</td></tr>
						</tbody>
					</table>
				</div>
				<div className="question">{this.props.question}</div>
			</div>
		);
	}
}

class Reply extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		if (!(this.props.reply == '' || this.props.reply == undefined || this.props.reply == null))
			return (
				<div className="text-reply">
					{this.props.reply}
				</div>
			);
		return (
			<div className="reply-box">
				<textarea id="editor"></textarea>
				<button className="btn submit-btn">回复</button>
			</div>
		);
	}
}

var id = $("#consult-id").val();

ReactDOM.render(<ConsultDetail consultId={id} consultUrl="/comments.json" />, document.getElementById('app'));