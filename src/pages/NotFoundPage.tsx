import { Link } from "react-router-dom"

export default function NotFoundPage() {
  return (
    <div>
      页面不存在 <Link to="/">回首页</Link>
    </div>
  )
}
