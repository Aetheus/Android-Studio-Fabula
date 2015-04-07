package com.aedrianheng.utils;

import android.app.Activity;
import android.net.Uri;
import android.os.AsyncTask;
import android.widget.Toast;

import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
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
public class CustomDownloader {

    public final String TAG = "CustomDownloader";
    CustomListener clisten;
    String url;


    //first listener should be downloadListener
    public CustomDownloader(String url, CustomListener clisten){
        this.clisten = clisten;
        this.url = url;
        Log.i(TAG,"Created object");
        //this.ViewID = ViewID;
        //this.parentActivity = parentActivity;
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

    private class CustomHttpAsyncTask extends AsyncTask<String, Void, String> {
        @Override
        protected String doInBackground(String... urls) {
            Log.i(TAG,"Starting background tasks");
            return GET(urls[0]);
        }
        // onPostExecute displays the results of the AsyncTask.
        @Override
        protected void onPostExecute(String result) {
            Log.i(TAG,"Background tasks complete");
            Log.i(TAG, "Result was: " + result);
            SetTextViewListener tvListener = (SetTextViewListener) clisten;
            tvListener.setText(result);
            tvListener.callbackMethod();
        }
    }

    //dummy function
    public void downloadFile(){
        new CustomHttpAsyncTask().execute(url);
    }

}
