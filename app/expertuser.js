import React from 'react'
import ReactDOM from 'react-dom'
//import $ from 'jquery'

var g_btns = [
    {id:1,text:"返回",link:"javascript:;"}
    //,{id:2,text:"只看此用户",link:"http://www.baidu.com"}
];

class ConsultDetail extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {

		return (
			<div className="container">
				<Header user="专家" column="咨询" function="回复咨询" />
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

	handleClick(e) {
		e.preventDefault();
		location.reload();
	}

	render() {
		let btns = this.props.btn.map(button => (
			<Button text={button.text} link={button.link} key={button.id} />
		));
		return (
			<div className="toolbar">
				{btns}
				<a onClick={this.handleClick.bind(this)} className="btn" href="javascript:;">刷新</a>
			</div>
		);
	}
}

class Button extends React.Component {
	constructor(props) {
		super(props);
	}

	handleClick(e) {
		e.preventDefault();
		window.history.back();
	}

	render() {
		return (
			<a className="btn" href={this.props.link} onClick={this.handleClick.bind(this)} >{this.props.text}</a>
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
			dataType:'json',
			data:{'id':this.props.consultId},
			success:function(resData) {
				
				this.setState({data:resData.obj});
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});

	}

	render() {
		let item = this.state.data.map(i => (
			<ContentItem user={i.username} 
			userpage={i.username} 
			content={i.describle} 
			key={i.id} 
			id={i.id}
			photos={i.tconsultationPics}
			title={i.title}
			type={i.type}
			asker={i.username}
			date={i.consulttime}
			question={i.describle}
			expertName={i.expert.name}
			reply={i.expertadvice} />
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
				</div>
				<div className="content">
					<div className="question-detail">
					<PictureViewer photos={this.props.photos}/>
					<Details theme={this.props.title} 
						type={this.props.type} 
						asker={this.props.asker} 
						date={this.props.date}
						question={this.props.question} />
					</div>
					<div>
						<Reply reply={this.props.reply} replyExpert={this.props.expertName} id={this.props.id} />
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
			image:this.props.photos.length == 0 ? null : this.props.photos[0].source,
			intro:this.props.photos.length == 0 ? null : this.props.photos[0].title
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
		// //let $scrollable = $(this.refs.scrollable);
		// //$scrollable.scrollable();
		// //$scrollable.hover(function() {
		// 		var $this = $(this);
		// 		if ($this.hasClass("current")) {
		// 			return false;
		// 		} else {
		// 			$scrollable.removeClass("current");
		// 			$this.addClass("current").click();
		// 		}
		// 	});		
	}

	componentDidUpdate() {
		$(this.refs.zoom).trigger('zoom.destroy');
		$(this.refs.zoom).zoom();
	}

	render() {
		var images = this.props.photos.length == 0 ? null : this.props.photos.map(picture => (
			<a className="current" href="javascript:;" key={picture.image} >
				<img src={picture.source} alt={picture.title} key={picture.order} onClick={this.handleClick.bind(this)} />
			</a>
		));

		return (

			<div className="container picture-view">
				<div className="zoom" ref="zoom">
					<img src={this.state.data.image} width='100%' height='320' alt={this.state.data.intro}/>
				</div>
				<div className="scrollable" ref="scrollable">
					<div className="items">{images}</div>
				</div>
			</div>
		);
	}
}

class Details extends React.Component {
	constructor(props) {
		super(props);
	}

	rawMarkup() {
		return { __html: this.props.question };
	}

	render() {
		let str = ['害虫识别','害虫防治','其他'];
		let t = str[parseInt(this.props.type)];

		return (
			<div className="container details">
				<div>
					<table>
						<tbody>
							<tr><td>主题：{this.props.theme}</td><td>类型：{t}</td></tr>
							<tr><td>咨询者：{this.props.asker}</td><td>咨询日期：{this.props.date}</td></tr>
						</tbody>
					</table>
				</div>
				<div className="question">
					<div>咨询描述：</div>
					<span dangerouslySetInnerHTML={this.rawMarkup()} />
				</div>
			</div>
		);
	}
}

class Reply extends React.Component {
	constructor(props) {
		super(props);
		this.state = {editor: null,reply:this.props.reply};
	}

	componentDidMount() {
		var editor = KindEditor.create(this.refs.editor, {
				items: [
					"source", "|", "undo", "redo", "|", "preview", "print", "template", "cut", "copy", "paste",
					"plainpaste", "wordpaste", "|", "justifyleft", "justifycenter", "justifyright",
					"justifyfull", "insertorderedlist", "insertunorderedlist", "indent", "outdent", "subscript",
					"superscript", "clearhtml", "quickformat", "selectall", "|", "fullscreen", "/",
					"formatblock", "fontname", "fontsize", "|", "forecolor", "hilitecolor", "bold",
					"italic", "underline", "strikethrough", "lineheight", "removeformat", "|", "image",
					"flash", "media", "insertfile", "table", "hr", "emoticons", "baidumap", "pagebreak",
					"anchor", "link", "unlink"
				],
				langType: "zh_CN",
				syncType: "form",
				filterMode: false,
				pagebreakHtml: '<hr class="pageBreak" \/>',
				allowFileManager: true,
				filePostName: "file",
				fileManagerJson: "/grainInsects/admin/file/browser",
				uploadJson: "/grainInsects/admin/file/upload",
				uploadImageExtension: "jpg,jpeg,bmp,gif,png",
				uploadFlashExtension: "swf,flv",
				uploadMediaExtension: "swf,flv,mp3,wav,avi,rm,rmvb",
				uploadFileExtension: "zip,rar,7z,doc,docx,xls,xlsx,ppt,pptx",
				extraFileUploadParams: {
					token: getCookie("token")
				},
				afterChange: function() {
					this.sync();
				}
			});
		this.setState({editor:editor});
	}

	rawMarkup() {
		return { __html: this.state.reply };
	}

	handleClick(e) {
		e.preventDefault();
		if (!confirm("是否确认提交？")) return;
		let advice = this.state.editor.html();
		$.ajax({
			url:'replyConsult',
			method:'post',
			data:{'id':this.props.id,'expertadvice':advice},
			success:function(resData) {
				let state = this.state;
				if (resData.success) {
					state.reply = advice;
					state.editor.remove();
					this.setState(state);
				} else
					alert("回复出现错误!");
			}.bind(this),
			error:function(xhr, status, err) {
		        alert("回复出现错误!");
		        console.error(this.props.url, status, err.toString());
		     }.bind(this)
		});
	}

	render() {
		if (!(this.state.reply == '' || this.state.reply == undefined || this.state.reply == null))
			return (
				<div className="text-reply">
				<div>专家{this.props.replyExpert}回复：</div><br/>
					<span dangerouslySetInnerHTML={this.rawMarkup()} />
				</div>
			);
		return (
			<div className="reply-box">
				<div>专家回复：</div><br/>
				<textarea ref="editor" className="editor"></textarea>
				<button className="btn submit-btn" onClick={this.handleClick.bind(this)}>回复</button>
			</div>
		);
	}
}

var id = $("#consult-id").val();

// 获取Cookie
function getCookie(name) {
	if (name != null) {
		var value = new RegExp("(?:^|; )" + encodeURIComponent(String(name)) + "=([^;]*)").exec(document.cookie);
		return value ? decodeURIComponent(value[1]) : null;
	}
}

ReactDOM.render(<ConsultDetail consultId={id} consultUrl="viewConsultation" />, document.getElementById('app'));