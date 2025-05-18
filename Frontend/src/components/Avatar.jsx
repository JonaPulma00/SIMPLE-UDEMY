import { getAvatarUrl } from "../services/avatarService"
export const Avatar = ({name, classname}) => {
  const avatarUrl = getAvatarUrl({name})
  return (
    <>
    <img src={avatarUrl} alt={`${name}'s Avatar`} className={classname}/>
    </>
  )
}
