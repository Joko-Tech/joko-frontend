import { Auth, API } from 'aws-amplify';

export async function getHttp(path, myInit, artistName) {
    const apiName = process.env.NEXT_PUBLIC_API_NAME;
    
    // Http API call init parameters
    (!myInit && (myInit = {}))
    myInit.headers = {
        Authorization: `Bearer ${(await Auth.currentSession())
            .getIdToken()
            .getJwtToken()}`
    };
    myInit.queryStringParameters = {
        artistName: artistName // OPTIONAL
    }
    console.log(myInit)
    // We make sure we have an authenticated user with fresh token
    await Auth.currentAuthenticatedUser();

    return API.get(apiName, path, myInit);
}

