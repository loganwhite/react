import React from 'react'
import ReactDOM from 'react-dom'
import Dropzone from 'react-dropzone'

//import $ from 'jquery'

var g_btns = [
    {id:1,text:"新咨询",link:"addConsultEntrance"},
    {id:2,text:"返回",link:"javascript:;"}
];

class ConsultDetail extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {

		return (
			<div className="container">
				<Header user="用户" column="咨询" function="详情" />
				<ToolBar btn={g_btns}  />
				<Content consultId={this.props.consultId} consultUrl={this.props.consultUrl} />
				<Reply rootId={this.props.consultId} />
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

	handleClick(e) {
		e.preventDefault();
		window.history.back();
	}

	render() {
		if (this.props.link == 'javascript:;') return (
			<a className="btn" href={this.props.link} onClick={this.handleClick.bind(this)}>{this.props.text}</a>
		);
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

	rawMarkup() {
		return { __html: this.props.reply || "" };
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
						<span dangerouslySetInnerHTML={this.rawMarkup()} />
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
		this.state = {editor: null,files:null};
		this.disableClick = false;
		this.multiple = true;
	}

	componentDidMount() {
		var editor = KindEditor.create(this.refs.editor, {
				allowFileManager : false,
				items: [
					"source", "|", "undo", "redo", "|", "preview", "print", "template", "cut", "copy", "paste",
					"plainpaste", "wordpaste", "|", "justifyleft", "justifycenter", "justifyright",
					"justifyfull", "insertorderedlist", "insertunorderedlist", "indent", "outdent", "subscript",
					"superscript", "clearhtml", "quickformat", "selectall", "|", "fullscreen", "/",
					"formatblock", "fontname", "fontsize", "|", "forecolor", "hilitecolor", "bold",
					"italic", "underline", "strikethrough", "lineheight", "removeformat", "|", "table", "hr", "emoticons", "baidumap", "pagebreak",
					"anchor", "link", "unlink"
				]
			});
		this.setState({editor:editor});
	}

	handleClick(e) {
		e.preventDefault();
		let advice = this.state.editor.html();
		let formData = new FormData($(this.refs.replyForm)[0]);
		formData.append("describle",advice);
		formData.append("zwId",this.props.rootId);
		this.state.files.forEach(function(v,i) {
			formData.append('TConsultationPics['+i+'].file',v);
		});
		console.log(formData);
		$.ajax({
			url:'pursueConsult',
			method:'post',
			dataType:'json',
			data:formData,
			contentType: false,  
			processData: false,
			success:function(resData) {
				//let state = this.state;
				if (resData.success) {
					//state.reply = advice;
					//this.setState(state);
					alert("追问成功！");
					location.reload();
				} else
					alert("追问出现错误!");
			}.bind(this),
			error:function(xhr, status, err) {
		        alert("追问出现错误!");
		        console.error(this.props.url, status, err.toString());
		     }.bind(this)
		});
	}

	onDrop(files) {
		if(files.length <= 6)
			this.setState({files:files});
		else
			alert("最多选择6张图片！");
    }

	render() {
		let file_item = null;
		if (this.state.files != null) {
		let i = -1;
		file_item = this.state.files.map(file => (
			<tr key={i++}>
				<td><input type="text" name={'TConsultationPics['+i+'].title'} /></td>
				<td>{file.name}</td>
				<td><input type="text" name={'TConsultationPics['+i+'].order'} /></td>
			</tr>
		));
	}

		return (
			<div className="reply-box">
				<div>咨询追问：</div><br/>
				<form ref='replyForm'>
				<div className="container">
				<Dropzone onDrop={this.onDrop.bind(this)} className="dropbox">
					<div>将咨询图片一次性拖放于此或点击此区域，最多6幅图片...</div>
				</Dropzone>
				<table>
						<thead>
							<tr>
								<th>标题</th>
								<th>文件</th>
								<th>排序</th>
							</tr>
						</thead>
						<tbody>
							{file_item}
						</tbody>
				</table>
				</div>

				<div className="reply-box-right">
				<textarea ref="editor" className="editor"></textarea>
				<button className="btn submit-btn" onClick={this.handleClick.bind(this)}>追问</button>
				</div>
				</form>
			</div>
		);
	}
}



var id = $("#consult-id").val();

ReactDOM.render(<ConsultDetail consultId={id} consultUrl="viewConsultation" />, document.getElementById('app'));