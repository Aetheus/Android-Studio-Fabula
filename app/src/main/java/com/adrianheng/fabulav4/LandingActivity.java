package com.adrianheng.fabulav4;

import android.app.Activity;
import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import android.widget.EditText;
import android.widget.TextView;

import com.aedrianheng.utils.NotificationBroadcastReceiver;
import com.aedrianheng.utils.NotificationLauncher;
import com.aedrianheng.utils.htmlApp.LandingWebViewClient;
import com.aedrianheng.utils.web.ScraperWebChromeClient;

import org.json.JSONException;
import org.json.JSONObject;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;
import java.util.TimeZone;


public class LandingActivity extends Activity {

    protected String username;
    protected String password;
    protected String globalSettingsJSON;

    //used by our backgroundtask
    protected int requestCode = 163837879;
    protected int defaultBackgroundInterval = 120;    //measured in minutes

    //allows us to use backbutton on our app by storing the values of which buttons were trigged html-side.
    protected ArrayList<String> htmlActionsList = new ArrayList<String>();

    private final String tag = "LandingActivity";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_landing);

        //if the notification message is still up, kill it
        NotificationLauncher NL = new NotificationLauncher(555,this.getApplicationContext());
        NL.cancelNotification();


        //get the globalSettings object (serialized in JSON)
        SharedPreferences sharedPreferences = getSharedPreferences(getString(R.string.preference_file_key), MODE_PRIVATE);
        this.globalSettingsJSON = sharedPreferences.getString("globalSettings", null);

        //get the intent that started tbis activity, and extract the sent USERNAME and PASSWORD from it, as well as the flag for whether or not the activity was started from a notification
        Intent ourStarter = getIntent();
        this.username = ourStarter.getStringExtra("USERNAME");
        this.password = ourStarter.getStringExtra("PASSWORD");
        boolean isFromNotification = ourStarter.getBooleanExtra("isFromNotification", false);
        String lastCheckTime = sharedPreferences.getString("lastCheckTime", null);
        Log.i(tag,"isFromNotification flag is : " + isFromNotification);
        Log.i(tag,"lastCheckTime is : " + isFromNotification);

        WebView landingWebview = (WebView) findViewById(R.id.landingWebview);
        landingWebview.getSettings().setJavaScriptEnabled(true);
        landingWebview.setWebViewClient(new LandingWebViewClient(username, password, globalSettingsJSON,lastCheckTime,isFromNotification));
        landingWebview.setWebChromeClient(new ScraperWebChromeClient(this));
        landingWebview.addJavascriptInterface(this,"FabulaSysApp");

        //allows file access from urls
        landingWebview.getSettings().setAllowFileAccess(true);
        landingWebview.getSettings().setAllowFileAccessFromFileURLs(true);
        landingWebview.getSettings().setAllowUniversalAccessFromFileURLs(true);

        landingWebview.loadUrl("file:///android_asset/htmlApp/index.html");

        updateCheckTime();

        //get background task settings
        JSONObject backgroundTaskSettings = getBackgroundTaskSettings();
        boolean isBackgroundTaskOn = true;
        int backgroundTaskInterval = 1;
        try {
            isBackgroundTaskOn = backgroundTaskSettings.getBoolean("isBackgroundTaskOn");
            backgroundTaskInterval = backgroundTaskSettings.getInt("backgroundInterval");
        } catch (JSONException e) {Log.e("LandingActivity", e.getMessage());}

        //if background is set to true, launch it
        if(isBackgroundTaskOn){
            Log.i(tag, "background was set to 'On' on first launch. launching it now");
            startBackgroundTask(backgroundTaskInterval);
        }
        //NotificationTest();
        //TextView mainMessage = (TextView) findViewById(R.id.landingMessage);
        //mainMessage.setText(username + " : " + password);
    }


    @JavascriptInterface
    public void updateActionsList(String elementID){
            htmlActionsList.trimToSize();

            Log.i(tag, "ActionsListUpdate: elementID to insert into ActionsList is " + elementID  );
            if(htmlActionsList.size() >=1){
                Log.i(tag, "ActionsListUpdate: Current last element of ActionsList is " + htmlActionsList.get(htmlActionsList.size() - 1 ) );
            }

            htmlActionsList.add(elementID);

            Log.i(tag, "ActionsListUpdate: updated. It now contains: " + Arrays.toString(htmlActionsList.toArray()) );


    }

    //our custom back button. when clicked, it virtually clicks the last clicked Route button in the webview, effectively going "back" in the html
    @Override
    public void onBackPressed() {
        Log.i(tag, "ActionsListBack: Back button pressed");
        Log.i(tag, "ActionsListBack: size is: " + htmlActionsList.size());
        Log.i(tag, "ActionsListBack: currently looks like this: " + htmlActionsList.toString());

        if (htmlActionsList.size() > 1){
            htmlActionsList.remove(htmlActionsList.size() - 1);
            htmlActionsList.trimToSize();
            String previousAction = (String) htmlActionsList.get((htmlActionsList.size() - 1));
            Log.i(tag,"ActionsListBack: previous action was :" + previousAction);

            WebView landingWebview = (WebView) findViewById(R.id.landingWebview);
            String javascriptInjection = "javascript: $('a[href=" + previousAction + "]').trigger('click')";
            Log.i(tag,"ActionsListBack: JS to inject is: " + javascriptInjection);
            landingWebview.loadUrl(javascriptInjection);

            //injecting our javascript will automatically trigger the updateActionsList function. hence, we need to remove the last added element again
            if(htmlActionsList.size() >= 1) {
                htmlActionsList.remove(htmlActionsList.size() - 1);
            }
            htmlActionsList.trimToSize();

            Log.i(tag, "ActionsListBack: now looks like this: " + htmlActionsList.toString());
        }else{
            this.finish();
        }

        if ((htmlActionsList.size() >= 2)    &&      htmlActionsList.get(htmlActionsList.size() - 1).equals(htmlActionsList.size() - 2) ){
            Log.i(tag, "ActionsListBack: last 2 actions were duplicates of one another. Removing the duplicate");
            htmlActionsList.remove(htmlActionsList.size() - 1);
            htmlActionsList.trimToSize();
            Log.i(tag, "ActionsListBack: now contains: " + Arrays.toString(htmlActionsList.toArray()) );
        }
    }


    //updates the lastCheckTime of our sharedPreferences
    @JavascriptInterface
    public void updateCheckTime(){
        SharedPreferences sharedPreferences = getSharedPreferences(getString(R.string.preference_file_key), MODE_PRIVATE);

        //get the currenttime as an ISO time string
        Date timeNow = new Date();
        TimeZone timeZone= TimeZone.getTimeZone("UTC");
        DateFormat dateFormat= new SimpleDateFormat("yyyy-MM-dd'T'HH:mm'Z'");
        dateFormat.setTimeZone(timeZone);
        String nowTimeString = dateFormat.format(timeNow);

        //update the lastcheckedtime to now
        sharedPreferences.edit().putString("lastCheckTime", nowTimeString).commit();
        Log.i(tag, "lastCheckTime has been updated to: " + nowTimeString);
    }

    //start background scheduled task
    @JavascriptInterface
    public void startBackgroundTask(int numOfMins){
        //our alarm's requestCode. we'll need this if we want to shut it down.
        Intent intent = new Intent(this.getApplicationContext(), NotificationBroadcastReceiver.class);
        intent.putExtra("username",username);
        intent.putExtra("password",password);

        int minutes = (60*1000);
        int intervalTime = numOfMins * minutes;

        PendingIntent pendingIntent = PendingIntent.getBroadcast(this.getApplicationContext(), requestCode, intent, Intent.FILL_IN_DATA);
        AlarmManager alarmManager = (AlarmManager) getSystemService(ALARM_SERVICE);
        alarmManager.setRepeating(AlarmManager.ELAPSED_REALTIME_WAKEUP,intervalTime,intervalTime, pendingIntent);
    }

    @JavascriptInterface
    public void stopBackgroundTask(){
        //our alarm's requestCode. we'll need this if we want to shut it down.
        Intent intent = new Intent(this.getApplicationContext(), NotificationBroadcastReceiver.class);
        intent.putExtra("username",username);
        intent.putExtra("password",password);


        PendingIntent pendingIntent = PendingIntent.getBroadcast(this.getApplicationContext(), requestCode, intent, Intent.FILL_IN_DATA);
        AlarmManager alarmManager = (AlarmManager) getSystemService(ALARM_SERVICE);

        alarmManager.cancel(pendingIntent);
    }

    @JavascriptInterface
    public String getBackgroundTaskSettingsAsJSONString(){
        JSONObject jsObj = getBackgroundTaskSettings();
        return jsObj.toString();
    }

    @JavascriptInterface
    public JSONObject getBackgroundTaskSettings(){
        SharedPreferences sharedPreferences = getSharedPreferences(getString(R.string.preference_file_key), MODE_PRIVATE);

        int backgroundInterval = sharedPreferences.getInt("backgroundInterval", 0);
        boolean isBackgroundTaskOn = sharedPreferences.getBoolean("isBackgroundTaskOn", false);

        //to check if the keys exist
        boolean isContainInterval =  sharedPreferences.contains("backgroundInterval");
        boolean isContainTaskOn =  sharedPreferences.contains("isBackgroundTaskOn");

        //if the backgroundInterval wasn't set, set it to the default of 1 minute
        if(!isContainInterval){
            sharedPreferences.edit().putInt("backgroundInterval", defaultBackgroundInterval).commit();
            backgroundInterval = defaultBackgroundInterval;
        }

        //if isBackgroundTaskOn was empty, set it to false by default
        if (!isContainTaskOn){
            sharedPreferences.edit().putBoolean("isBackgroundTaskOn", false).commit();
            isBackgroundTaskOn = false;
        }

        JSONObject returnObj = new JSONObject();
        try {
            returnObj.put("backgroundInterval",backgroundInterval);
            returnObj.put("isBackgroundTaskOn",isBackgroundTaskOn);
        } catch (JSONException e) {
            e.printStackTrace();
            Log.e("LandingActivity", e.getMessage());
        }
        return returnObj;
    }

    @JavascriptInterface
    public void setBackgroundTaskSettings(boolean isBackgroundTaskOn, int intervalTime){
        SharedPreferences sharedPreferences = getSharedPreferences(getString(R.string.preference_file_key), MODE_PRIVATE);

        sharedPreferences.edit().putInt("backgroundInterval", intervalTime).commit();
        sharedPreferences.edit().putBoolean("isBackgroundTaskOn", isBackgroundTaskOn).commit();

        Log.i(tag, "interval: " + intervalTime + " | isBackgroundTaskOn: " + isBackgroundTaskOn);
        if (!isBackgroundTaskOn){
            stopBackgroundTask();
        }else{
            startBackgroundTask(intervalTime);
        }
    }


    //temp function to test around with notifications
    public void NotificationTest(){
        Context context = this;
        Intent intent = new Intent(context,LandingActivity.class);
        int notificationID = 555;

        SharedPreferences sharedPreferences = getSharedPreferences(getString(R.string.preference_file_key), MODE_PRIVATE);
        String lastTimeString = sharedPreferences.getString("lastCheckTime", null);
        Date timeNow = new Date();
            TimeZone timeZone= TimeZone.getTimeZone("UTC");
            DateFormat dateFormat= new SimpleDateFormat("yyyy-MM-dd'T'HH:mm'Z'");
            dateFormat.setTimeZone(timeZone);
        String nowTimeString = dateFormat.format(timeNow);

        NotificationLauncher NL = new NotificationLauncher(intent,context,"now: " + nowTimeString, "last: " + lastTimeString ,notificationID);
        NL.launchNotification();
    }



    @JavascriptInterface
    public void goToScraper(String url){
        Intent intent = new Intent(this,ScraperActivity.class);
        intent.putExtra("USERNAME", username);
        intent.putExtra("PASSWORD", password);
        intent.putExtra("URL", url);
        //intent.putExtra("URL", "http://webspace.apiit.edu.my/");

        runOnUiThread(new LaunchScraper(intent,this));
    }

    @JavascriptInterface
    public void openLink(String url){
        Intent intent = new Intent(this,ExternalPreview.class);
        intent.putExtra("url", url);

        runOnUiThread(new LaunchScraper(intent,this));
    }


    @JavascriptInterface
    public void signOut(){
        SharedPreferences sharedPreferences = this.getSharedPreferences(this.getString(R.string.preference_file_key), Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.remove("username");
        editor.remove("password");
        editor.remove("globalSettings");
        editor.commit();
        this.finish();
    }

    @JavascriptInterface
    public void saveJSONSettings(String JSONObject){
        //this way of getting the shared preferences should work on services, too
        SharedPreferences sharedPreferences = getSharedPreferences(getString(R.string.preference_file_key), MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.putString("globalSettings",JSONObject);
        editor.commit();
    }

    private class LaunchScraper implements Runnable {
        Intent intent;
        Context context;

        public LaunchScraper(Intent intent, Context context){
            super();
            this.intent = intent;
            this.context = context;
        }

        @Override
        public void run() {
            context.startActivity(intent);
        }
    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_landing, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }
}
