import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { asyncDeleteFetch, asyncUpdateFetch} from '../../app/slice/CreateSlice';
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { asyncDeleteFetch, asyncSaveFetch, asyncUpdateFetch} from '../../app/slice/CreateSlice';
import { useNavigate, useParams } from "react-router-dom";

function Content() {
  const [content, setContent] = useState();
  const [mode, setMode] = useState("read");
  const [text, setText] = useState({title:"", content:""});

  const [text, setText] = useState();
  const [refresh, setRefresh] = useState(false)
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const param = useParams();
  // const { state } = useLocation();
  const state = useSelector(state => state.store);

  useEffect(()=>{
    dispatch(asyncSaveFetch());
    setRefresh(false)
  },[dispatch, refresh])

  useEffect(() => {
      setContent(state);
      setText({...text, title:state.title, content:state.content})
  }, [mode])
      if (state.length !== 0) {
        const detailData = state.find(elem => elem.postID === Number(param.id))
        setContent(detailData);
        setText({...text, title:detailData.title, content:detailData.content})
      }
  }, [mode, state])


  // moving Main page
  function backspaceMain() {
    navigate('/');
  }

  // toogle box setting
  function toggleButtonActive (event) {
    const box = event.target.nextElementSibling;
    box.style.display === '' || box.style.display === 'none' ? box.style.display = 'flex' : box.style.display = 'none'
  }

  //read mode setting
  function deleteContent () {
    dispatch(asyncDeleteFetch(content.id));
    alert("포스트를 삭제했습니다!")
    navigate('/');
  }

  function modifyContent () {
    setMode('modify')
  }

  // modify mode setting
  function modifyCancel () {
    setMode('Read')
  }

  function modifyForm(event) {
    const { name, value } = event.target;
    setText({...text, [name]:value})
  }

  function modifyVerified(event) {
    event.preventDefault();

    if (text.title === "") {
      alert("수정할 제목을 작성해주십시오.")
      return
    } else if (text.content === "") {
      alert("수정할 내용을 작성해주십시오.")
      return
    } 

    const updateData = {author: content.author, id: content.id, title: text.title, content: text.content, postID: content.postID}
    const updateData = {...content, title: text.title, content: text.content}
    dispatch(asyncUpdateFetch(updateData))
    alert("수정이 완료됐습니다!")
    navigate(`/detail/${updateData.postID}`, {state: updateData})
    setRefresh(true)
    setMode('Read')
  }

  // if mode === 'Modify' then
  return (
    <>
      {content === undefined ? <div> Now Loading... </div> : mode === 'modify' ?
        <ModifyContainer onSubmit={modifyVerified}>
          <ContentHead>
            <HeadProfile>
              <HeadProfileName>{content.author}</HeadProfileName>
              <HeadProfileID>@{content.postID}</HeadProfileID>
            </HeadProfile>
          </ContentHead>
          <ContentModifyTitle name="title" value={text.title} onChange={modifyForm} placeholder="수정할 제목을 입력해주세요."></ContentModifyTitle>
          <ContentModifyBody name="content" value={text.content} onChange={modifyForm} placeholder="수정할 내용을 입력해주세요."></ContentModifyBody>
          <ButtonMenu>
            <MenuBoxBtn type="submit">수정</MenuBoxBtn>
            <MenuBoxBtn onClick={modifyCancel}>취소</MenuBoxBtn>
          </ButtonMenu>
        </ModifyContainer>

      :

        // if mode === 'Read' then
        <ContentContainer>
          <BackSpaceBtn onClick={backspaceMain}>←　스레드</BackSpaceBtn>
          <ContentHead>
            <HeadProfile>
              <HeadProfileName>{content.author}</HeadProfileName>
              <HeadProfileID>@{content.postID}</HeadProfileID>
            </HeadProfile>
            <ContentMenu type="button" onClick={toggleButtonActive}>· · ·</ContentMenu>
            <MenuBox display="flex">
              <Triangle></Triangle>
              <MenuBoxBtn color='#15202b' radius="5px 5px 0 0" onClick={deleteContent}>내용 삭제하기</MenuBoxBtn>
              <MenuBoxBtn color='#15202b' radius="0 0 5px 5px" onClick={modifyContent}>내용 수정하기</MenuBoxBtn>
            </MenuBox>
          </ContentHead>
          <ContentTitle>{content.title}</ContentTitle>
          <ContentBody>{content.content}</ContentBody>
        </ContentContainer>
      }
  </>
  )
}

const ContentContainer = styled.div`
  background-color: #15202b;
  display:flex;
  flex-direction: column;
  justify-content: flex-start;

  color: #ffffff;

  border:1px solid gray;
  /* border-left:2px solid black; */
  padding: 0 2rem;
  margin:auto;
  margin:0;
  margin-top: 0;

  width: 600px;
  height: 100vh;
  height: 70vh;

  box-sizing: border-box;
`

const BackSpaceBtn = styled.button`
  background: none;

  color: #ffffff;
  font-weight: 700;
  font-size: 1.5rem;

  display: block;

  border:none;
  margin: 0;
  margin-top: 1rem;
  margin-right: auto;

  cursor:pointer;
`

const ContentHead = styled.div`
  display: flex;
  flex-direction: row;
  justify-content:space-between;
  position: relative;

  border-bottom: 3px solid gray;
  padding-top:2rem;
  padding-bottom: 1rem;
`

const HeadProfile = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
`

const HeadProfileName = styled.span`
  font-size: 1.3rem;
  font-weight: 700;
`

const HeadProfileID = styled.span`
  font-size: 0.8rem;
`

const ContentMenu = styled.button`
  background: none;

  color: #ffffff;
  font-weight:900;
  
  border: none;
  
  cursor: pointer;
`

const ContentTitle = styled.h2`
  font-size: 2.2rem;
  text-align: left;
`

const ContentBody = styled.p`
  font-size: 1.3rem;
  text-align: left;
`

const MenuBox = styled.div`
  background-color: #ffffff;

  display: none;
  flex-direction: column;
  position: absolute;

  border: none;
  border-radius: 5px;
  top:70px;
  right:0;

  &:first-child {
    border-radius: 5px 5px 0 0;
  }

  &:last-child {
    border-radius: 5px 5px;
  }
`

const MenuBoxBtn = styled.button`
  background: none;

  color: ${props => props.color || '#ffffff'};
  font-weight: 700;

  border:none;
  padding:0.5rem 1rem;

  cursor: pointer;
  transition: 0.1s ease;

  &:hover{
    background-color: gray;
    border-radius: ${props => props.radius || "5px"};
    color:white;
  }
`

const Triangle = styled.div`
  position: absolute;
  width: 0; 
  height: 0; 
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  
  border-bottom: 10px solid #ffffff;;
  margin: 0;

  transform: translateX(93px) translateY(-10px);
`

const ContentModifyTitle = styled.input`
  background-color: #15202b;

  font-size: 1.9rem;
  text-align: left;
  color: #ffffff;

  border:none;
  outline:none;
  border-bottom: 1px solid gray;
  border-radius: 0;

  margin: 0.5rem 0;
  padding: 0.5rem;
`

const ContentModifyBody = styled.textarea`
  background-color: #15202b;

  font-size: 1rem;
  text-align: left;
  color: #ffffff;

  border:none;
  border-bottom: 1px solid gray;
  border-radius: 0;
  outline:none;
  margin: 0.5rem 0;
  padding: 0.5rem;

  height: 200px;
  resize: vertical;
`

const ModifyContainer = styled.form`
  background-color: #15202b;

  display:flex;
  flex-direction: column;
  justify-content: flex-start;

    color: #ffffff;

  border-right:2px solid black;
  border-left:2px solid black;
  padding: 0 2rem;
  padding-top: 4rem;
  margin:auto;

  width: 600px;
  height:100vh;

  box-sizing: border-box;
`

const ButtonMenu = styled.div`
  display:flex;
  flex-direction: row;
  justify-content: flex-end;
  gap:1rem;
  margin: 0.5rem 0;
`

export default Content;
