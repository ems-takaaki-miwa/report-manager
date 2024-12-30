import { Outlet } from "react-router"
export default function Text() {
    return (
        <div>
            <h1>Text</h1>
            <p>Text page</p>
            <Outlet/>
        </div>
    )
}