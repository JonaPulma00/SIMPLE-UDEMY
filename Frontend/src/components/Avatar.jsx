import { getAvatarUrl } from "../services/avatarService"
export const Avatar = ({name, className}) => {
  const avatarUrl = getAvatarUrl({name})
  return (
    <>
    <img src={avatarUrl} alt={`${name}'s Avatar`} className={className}/>
    </>
  )
}
