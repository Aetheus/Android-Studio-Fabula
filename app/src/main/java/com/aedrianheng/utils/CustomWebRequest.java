package com.aedrianheng.utils;

import android.app.Activity;
import android.net.Uri;
import android.os.AsyncTask;
import android.widget.Toast;

import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicHeader;
import org.apache.http.protocol.HTTP;
import org.apache.http.util.EntityUtils;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.util.List;

import android.util.Log;

/**
 * Created by aedrian on 07-Apr-15.
 */
public class CustomWebRequest {

    public final String TAG = "CustomWebRequest";


    CustomListener clisten;
    String url;
    JSONObject postParam;



    //first listener should be downloadListener
    public CustomWebRequest(String url, CustomListener clisten){
        this.clisten = clisten;
        this.url = url;
        Log.i(TAG,"Created object");
    }

    public CustomWebRequest(String url, CustomListener clisten, JSONObject postParam){
        this.clisten = clisten;
        this.url = url;
        this.postParam = postParam;
        Log.i(TAG,"Created object");
    }

    public String POST(String url, JSONObject jsobj){
        InputStream inputStream = null;
        String result = "";

        try {
            HttpClient httpClient = new DefaultHttpClient();
            HttpPost post = new HttpPost(url);


            StringEntity entity = new StringEntity(jsobj.toString());
            Log.i(TAG,"The JSONObject in toString looks like this: " + jsobj.toString());
            Log.i(TAG,"The entity in toString looks like this: " );
            post.setHeader("Content-type", "application/json");
            post.setEntity(entity);


            HttpResponse response = httpClient.execute(post);

            inputStream = response.getEntity().getContent();

            if (inputStream != null) {
                result = convertInStreamToString(inputStream);
            }


        }catch (Exception e){
            //catch anything else we may have missed
            e.printStackTrace();
        }

        return result;

    }

    public String GET(String url){
        InputStream inputStream = null;
        String result = "";

        try{
            //create a HTTP client
            HttpClient httpClient = new DefaultHttpClient();

            //build querystring uri
            Uri.Builder builder = Uri.parse(url).buildUpon();
            builder.appendQueryParameter("key","value");
            String url2 = builder.build().toString();
            Log.i(TAG, "Querystring URL was: " + url2);

            //make a get request object
            HttpGet GetRequest = new HttpGet(url2);

            // This only works for POST, so forget it. we'll build a GET request maker ourselves
            //create a jsonObj, parse it to a StringEntity. Set the Requests StringEntity to this
            //JSONObject jsonobj = new JSONObject();
            //StringEntity se;
            //try{
            //    jsonobj.put("email", "a@b.com");
            //    jsonobj.put("old_passw", "306");
            //    jsonobj.put("use_id", "123");
            //    jsonobj.put("new_passw", "456");
            //    se = new StringEntity(jsonobj.toString());
            //}catch(JSONException e){
            //    e.printStackTrace();
            //}catch(UnsupportedEncodingException e){
            //    e.printStackTrace();
            //}

            /*make request*/
            HttpResponse httpResponse = httpClient.execute(GetRequest);

            //receive resp as instream
            inputStream = httpResponse.getEntity().getContent();

            //if instream was succesful, conver it to a string
            if(inputStream != null){
                result = convertInStreamToString(inputStream);
            }


        }catch(ClientProtocolException e){
            e.printStackTrace();
        }catch(IOException e){
            e.printStackTrace();
        }

        return result;

    }

    private static String convertInStreamToString(InputStream inputStream) throws IOException{
        BufferedReader bufferedReader = new BufferedReader( new InputStreamReader(inputStream));
        String line = "";
        String result = "";
        while((line = bufferedReader.readLine()) != null)
            result += line;

        inputStream.close();
        return result;

    }

    private class CustomHttpGetAsyncTask extends AsyncTask<String, Void, String> {
        @Override
        protected String doInBackground(String... urls) {
            Log.i(TAG,"Starting background GET task");
            return GET(urls[0]);
        }
        // onPostExecute displays the results of the AsyncTask.
        @Override
        protected void onPostExecute(String result) {
            Log.i(TAG,"Background GET task complete");
            Log.i(TAG, "Result was: " + result);

            JSONObject json = null;
            String betterText = "";

            try{
                json =  new JSONObject(result);
                betterText = json.toString(1);
            }catch(JSONException e){
                e.printStackTrace();
            }

            clisten.callbackMethod(result);
        }
    }

    private class CustomHttpPostAsyncTask extends AsyncTask<String, Void, String> {


        @Override
        protected String doInBackground(String... urls) {
            Log.i(TAG,"Starting background POST task");
            return POST(urls[0],postParam);
        }
        // onPostExecute displays the results of the AsyncTask.
        @Override
        protected void onPostExecute(String result) {

            Log.i(TAG,"Background POST task complete");
            Log.i(TAG, "Result was: " + result);

            JSONObject json = null;
            String betterText = "";

            try{
                json =  new JSONObject(result);
                betterText = json.toString(1);
            }catch(JSONException e){
                e.printStackTrace();
            }

            Log.i(TAG,"Going to call callback");
            clisten.callbackMethod(result);
        }
    }

    public void GetRequest(){
        new CustomHttpGetAsyncTask().execute(url);
    }

    public void PostRequest(){
        new CustomHttpPostAsyncTask().execute(url);
    }

}
