import {useNavigate} from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();

    return (
        <div style={{padding: "2rem", textAlign: "center"}}>
            <h1>Home Page</h1>
            <button className='download-button' onClick={() => navigate("/login")}>
                Go to Login
            </button>
            <button className='download-button' onClick={() => navigate("/create-post")}>
                Creat post
            </button>
            <button className='download-button' onClick={() => navigate("/posts")}>
                See posts
            </button>
        </div>
    );
}
