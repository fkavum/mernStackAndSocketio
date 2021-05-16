import {React,useCallback, useEffect , useState } from 'react'  //useEffect,useRef , useCallback  ...
import Quill from 'quill';
import "./textEditor.css";
import "quill/dist/quill.snow.css";
import {io} from "socket.io-client";
import {useParams} from 'react-router-dom';

const SAVE_INTERVAL_MS = 2000
const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
]

export default function TextEditor(){
    const {id:documentId} = useParams(); //parameter coms from uri (document/:id) -> also we are rewriting this id to documentId
    const [socket,setSocket] = useState(); //To make them global variable!
    const [quill, setQuill] = useState();

    //Make connection to socket
    useEffect(() => {
        const s = io("http://localhost:3001");

        setSocket(s);

        return () => {
            s.disconnect({data:"disconnected user"});
        } 
    },[]);

    //To have a special room for pages.
    useEffect(() => {
        if(socket == null || quill == null) return;

        //Sent server this event only once.
        socket.once("load-document", document => {
            quill.setContents(document);
            quill.enable(true);
        });

        socket.emit("get-document", documentId)

    },[socket,quill,documentId]);

    //Save data to mongoose
    useEffect(() => {
        if(socket == null || quill == null) return;
        
        const interval = setInterval(()=> {
            socket.emit("save-document", quill.getContents());
        }, SAVE_INTERVAL_MS);

        return () => {clearInterval(interval);}
    },[socket,quill])

    //Receive from server if text changes
    useEffect(() => {
        if(socket == null || quill == null) return;
        const handler = (delta) => {
            quill.updateContents(delta);
        } 

        socket.on('receive-changes', handler);

        return () => {
            socket.off('receive-changes',handler);
        } 
    },[socket,quill])

    //Emit to server if text changes
    useEffect(() => {
        if(socket == null || quill == null) return;
        const handler = (delta, oldDelta, source) => {
            if(source !== "user") { //could be api instead of user
                return;
            }

            socket.emit("send-changes", delta);
        } 

        quill.on('text-change', handler);

        return () => {
            quill.off('text-change',handler);
        } 
    },[socket,quill])

    const wrapperRef = useCallback(
        wrapper => {

            if(wrapper == null) return;

            wrapper.innerHTML = '';
            const editor = document.createElement('div');
            wrapper.append(editor);
            const q = new Quill(editor, {theme: "snow", modules: { toolbar: TOOLBAR_OPTIONS }});
            
            q.enable(false);
            q.setText('Loading...')
            setQuill(q);
        },
        []
    );

    return (
        <div className = "container" ref = {wrapperRef}>
        </div>
    )
}