import { useLocation } from "react-router-dom";

function UserInfo() {
	const location = useLocation();

  return (
		<div>
			<pre>
				{JSON.stringify(location.state, null, 4)} 
			</pre>
		</div>
  );
}

export default UserInfo;