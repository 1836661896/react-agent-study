import { Link } from "react-router-dom"
import { ROUTES } from "@/constants/routes"

export default function NotFoundPage() {
  return (
    <div>
      页面不存在 <Link to={ROUTES.home}>回首页</Link>
    </div>
  )
}
