import { getAvatarUrl } from "../services/avatarService"
export const Avatar = ({name}) => {
  const avatarUrl = getAvatarUrl({name})
  return (
    <>
    <img src={avatarUrl} alt={`${name}'s Avatar`}/>
    </>
  )
}
