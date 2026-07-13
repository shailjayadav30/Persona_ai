import Chat from "../components/Chat";
import { Suspense } from "react";

export default  function ChatPage(){
    return (
        <Suspense >
            <Chat/>
        </Suspense>
    )
}