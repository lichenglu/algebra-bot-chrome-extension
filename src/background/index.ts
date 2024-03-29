import {
  GoogleAuthProvider,
  signInWithCredential,
  signOut,
  AuthError,
  User,
} from "firebase/auth";
import {
  ref,
  get,
  set,
  push,
  update,
  serverTimestamp,
} from "firebase/database";

import { firebaseAuth, firebaseDB } from "@/services/firebase";
import { ChromeMessage, ChromeEvents, FirebaseWritePayload } from "@/types";
import { setBackgroundState } from "@/utils";

const saveOrUpdateDataOfFieldToUser = async (
  userId: string | undefined,
  field: string,
  data: any
) => {
  try {
    if (!userId) {
      return;
    }

    const dataRef = ref(firebaseDB, `users/${userId}/${field}`);
    const current = await get(dataRef);
    const hasBeenCreated = !!current.val();

    update(
      dataRef,
      hasBeenCreated
        ? {
            ...JSON.parse(JSON.stringify(data)),
            updatedAt: serverTimestamp(),
          }
        : {
            ...JSON.parse(JSON.stringify(data)),
            createdAt: serverTimestamp(),
          }
    );
  } catch (err) {
    console.log(err);
  }
};

const extractUserAccountId = async () => {
  const cookie = await chrome.cookies.get({
    url: "https://web.algebranation.com",
    name: "ci_session",
  });
  const decoded = decodeURIComponent(cookie?.value!);
  const useraccountIdIdx = decoded.indexOf("useraccount_id");
  const idMatch = decoded.slice(useraccountIdIdx).match(/"[0-9]+"/);
  let useraccountId: string = "";
  let fallbackUseraccountId: string = "";

  if (idMatch && idMatch[0]) {
    useraccountId = idMatch[0].replace(/"/g, "");
    console.log("useraccount_id", useraccountId);
  }

  // fallback to vague useraccount_id
  fallbackUseraccountId = decoded.slice(
    useraccountIdIdx,
    useraccountIdIdx + "useraccount_id".length + 20
  );

  return { useraccountId, fallbackUseraccountId };
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    appState: {
      enableChatbot: true,
    },
  });
});

const handleUserLogin = async (user: User | null) => {
  // signOut(firebaseAuth)
  const { useraccountId, fallbackUseraccountId } = await extractUserAccountId();

  if (user) {
    saveOrUpdateDataOfFieldToUser(user.uid, "profile", {
      ...user.toJSON(),
    });

    if (useraccountId.trim()) {
      saveOrUpdateDataOfFieldToUser(user.uid, "profile", {
        algebraNationData: {
          useraccountId,
          fallbackUseraccountId,
        },
      });
    }
  }

  await setBackgroundState({
    user: (user?.toJSON?.() as User) ?? null,
    algebraNationData: {
      useraccountId,
      fallbackUseraccountId,
    },
  });
};

// track authentication
const authSubscrition = firebaseAuth.onAuthStateChanged(handleUserLogin);

chrome.runtime.onConnect.addListener(async () => {
  console.log("connected!");
});

chrome.runtime.onMessage.addListener(async (message: ChromeMessage) => {
  // login
  if (message.type === ChromeEvents.login) {
    // https://prog.world/firebase-auth-in-chrome-extension-manifest-v3/
    // chrome.identity.getAuthToken({ interactive: true }, async (token) => {
    //   try {
    //     let credential = GoogleAuthProvider.credential(null, token);
    //     await signInWithCredential(firebaseAuth, credential);
    //   } catch (err) {
    //     console.log(err);
    //     // https://stackoverflow.com/a/14245504
    //     chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    //       chrome.tabs.sendMessage(tabs[0].id!, {
    //         type: ChromeEvents.loginError,
    //         payload: {
    //           message: `Failed to login - ${(err as AuthError).message}`,
    //         },
    //       });
    //     });
    //   }
    // });

    // https://gist.github.com/raineorshine/970b60902c9e6e04f71d?permalink_comment_id=3168397
    const redirectURL = chrome.identity.getRedirectURL();
    const { oauth2 } = chrome.runtime.getManifest();
    if (!oauth2) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id!, {
          type: ChromeEvents.loginError,
          payload: {
            message: `Failed to login - no oauth info provided'}`,
          },
        });
      });
      return;
    }
    const clientId = oauth2.client_id;
    const authParams = new URLSearchParams({
      client_id: clientId,
      response_type: "token",
      redirect_uri: redirectURL,
      scope: ["email"].join(" "),
    });
    const authURL = `https://accounts.google.com/o/oauth2/auth?${authParams.toString()}`;
    chrome.identity.launchWebAuthFlow(
      { url: authURL, interactive: true },
      async (responseUrl) => {
        if (chrome.runtime.lastError || !responseUrl) {
          chrome.tabs.query(
            { active: true, currentWindow: true },
            function (tabs) {
              chrome.tabs.sendMessage(tabs[0].id!, {
                type: ChromeEvents.loginError,
                payload: {
                  message: `Failed to login - ${
                    chrome.runtime.lastError?.message ??
                    "no response url returned"
                  }`,
                },
              });
            }
          );
          return;
        }

        const url = new URL(responseUrl);
        const urlParams = new URLSearchParams(url.hash.slice(1));
        const params = Object.fromEntries(urlParams.entries()); // access_token, expires_in

        let credential = GoogleAuthProvider.credential(
          null,
          params.access_token
        );
        await signInWithCredential(firebaseAuth, credential);
      }
    );
  }

  // forward message to play video of BEST version
  if (message.type === ChromeEvents.startVideo) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id!, {
        type: ChromeEvents.loadWithVideo,
        payload: {
          videoId: message.payload,
        },
      });
    });
  }

  // write data to DB
  if (message.type === ChromeEvents.writeDataToDB) {
    const { field, data } = message.payload as FirebaseWritePayload;
    const userId = firebaseAuth.currentUser?.uid;
    saveOrUpdateDataOfFieldToUser(userId, field, data);
  }
});

// this does not apply to the BEST version of AN
// chrome.tabs.onUpdated.addListener(
//   function(tabId, changeInfo, tab) {
//     // read changeInfo data and do something with it
//     // like send the new url to contentscripts.js
//     if (changeInfo.url?.includes('video/')) {
//       const match = changeInfo.url.match(/[0-9]+/)
//       if (!match) {
//         return
//       }
//       chrome.tabs.sendMessage(tabId, {
//         type: ChromeEvents.loadWithVideo,
//         payload: {
//           videoId: match[0]
//         }
//       })
//     }
//   }
// );
