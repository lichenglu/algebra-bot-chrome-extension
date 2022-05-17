// import { getAuth, GoogleAuthProvider, signInWithCredential } from "firebase/auth";

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    appState: {
      enableChatbot: true,
    },
  });
});

const extractUserAccountId = async () => {
  const cookie = await chrome.cookies.get({
    url: "https://web.algebranation.com",
    name: "ci_session",
  });
  const decoded = decodeURIComponent(cookie?.value!);
  const useraccountIdIdx = decoded.indexOf("useraccount_id");
  const idMatch = decoded.slice(useraccountIdIdx).match(/"[0-9]+"/);
  let useraccountId: string;
  let fallbackUseraccountId: string;
  if (idMatch && idMatch[0]) {
    useraccountId = idMatch[0].replace(/"/g, "");
    console.log("useraccount_id", useraccountId);
  } else {
    // fallback to vague useraccount_id
    fallbackUseraccountId = decoded.slice(
      useraccountIdIdx + "useraccount_id".length,
      useraccountIdIdx + "useraccount_id".length + 25
    );
  }
};

chrome.runtime.onConnect.addListener(extractUserAccountId);

// chrome.identity.getAuthToken({}, async (token) => {
//   let credential = GoogleAuthProvider.credential(null, token);
//   const auth = getAuth()
//   const res = await signInWithCredential(auth, credential)
//     // .then((userCredential) => {
//     //   const user = firebase.auth().currentUser;
//     //   dispatch({ type: SIGN_IN, payload: { error: "success", user } });
//     // })
//     // .catch((error: any) => {
//     //   console.error(error);
//     //   dispatch({ type: SIGN_IN, payload: { error: error.code } });
//     // });
// });
