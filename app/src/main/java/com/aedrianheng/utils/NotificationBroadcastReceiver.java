package com.aedrianheng.utils;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.support.v4.app.NotificationCompat;
import android.util.Log;
import android.widget.Toast;

import com.adrianheng.fabulav4.LandingActivity;
import com.adrianheng.fabulav4.R;

import org.json.JSONException;
import org.json.JSONObject;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;

/**
 * Created by Adrian on 22/5/2015.
 */
public class NotificationBroadcastReceiver  extends BroadcastReceiver {


    private class ServiceCommListener implements CustomListener{
        private Context context;
        private Intent intent;

        @Override
        public String listenerType() {
            return "ServiceCommListener";
        }

        ServiceCommListener(Context context, Intent intent){
            this.context = context;
            this.intent = intent;
        }

        @Override
        public void callbackMethod(Object... o) {
            int ourNotifyID = 555;
            int rowcount = 0;

            boolean isErrorFree = true;

            try{
                JSONObject tempJson = new JSONObject((String) o[0]);
                rowcount = tempJson.getInt("rowCount");
            }catch (Exception e){
                Log.e(listenerType(), e.getMessage());
                isErrorFree = false;
            }

            Log.i(listenerType(),"rowcount: " + rowcount);

            if(rowcount > 0){
                PendingIntent contentIntent = PendingIntent.getActivity(context, 1,
                        new Intent(context, LandingActivity.class), PendingIntent.FLAG_CANCEL_CURRENT);

                String title = "Fabula: " + rowcount + " new news items";
                String message = new Date().toString();

                NotificationCompat.Builder mBuilder =
                        new NotificationCompat.Builder(context)
                                .setSmallIcon(R.drawable.alert_icon)
                                .setContentTitle(title)
                                .setContentText(message);
                mBuilder.setContentIntent(contentIntent);

                NotificationManager mNotificationManager =
                        (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);

                mNotificationManager.notify(ourNotifyID, mBuilder.build());
            }else{
                Log.i(listenerType(),"No new rows, so no notification launched");
            }

            if(isErrorFree){
                updateCheckTime(context);
            }else{
                Log.i(listenerType(), "An error occured while parsing the JSON, so we won't update this time. It's safe, and likely just bcuz no internet");
            }
        }
    }

    public void updateCheckTime(Context context){
        SharedPreferences sharedPreferences = context.getSharedPreferences(context.getString(R.string.preference_file_key), context.MODE_PRIVATE);

        //get the currenttime as an ISO time string
        Date timeNow = new Date();
        TimeZone timeZone= TimeZone.getTimeZone("UTC");
        DateFormat dateFormat= new SimpleDateFormat("yyyy-MM-dd'T'HH:mm'Z'");
        dateFormat.setTimeZone(timeZone);
        String nowTimeString = dateFormat.format(timeNow);

        //update the lastcheckedtime to now
        sharedPreferences.edit().putString("lastCheckTime", nowTimeString).commit();
    }

    public String getLastCheckTime(Context context){
        SharedPreferences sharedPreferences = context.getSharedPreferences(context.getString(R.string.preference_file_key), context.MODE_PRIVATE);

        String lastCheckTime = sharedPreferences.getString("lastCheckTime",null);
        return lastCheckTime;
    }

    @Override
    public void onReceive(Context context, Intent intent) {
        Log.i("BroadReceive", "triggered");
        //Intent intent, Context context, String title, String message, int notifyID
        //Intent ourIntent = new Intent(context,LandingActivity.class);
        //Context ourContext = context;
        //int ourNotifyID = 555;
//
        //String ourTitle = new Date().toString();
        //String ourMessage = " Click to go to app ";
//
        //NotificationLauncher NL = new NotificationLauncher(ourIntent,ourContext,ourTitle,ourMessage,ourNotifyID);

        /*this should not be necessary as the broadcastreceiver alarmmanager SHOULD be disableable.
        in the even that it is, however, at least we can avoid constant POST requests*/
        SharedPreferences sharedPreferences = context.getSharedPreferences(context.getString(R.string.preference_file_key), context.MODE_PRIVATE);
        boolean isBackgroundTaskOn = sharedPreferences.getBoolean("isBackgroundTaskOn",false);

        if(isBackgroundTaskOn){
            String username = intent.getStringExtra("username");
            String password = intent.getStringExtra("password");

            String startTime = getLastCheckTime(context);
            //get the currenttime as an ISO time string
                Date timeNow = new Date();
                TimeZone timeZone= TimeZone.getTimeZone("UTC");
                DateFormat dateFormat= new SimpleDateFormat("yyyy-MM-dd'T'HH:mm'Z'");
                dateFormat.setTimeZone(timeZone);
                String nowTimeString = dateFormat.format(timeNow);
            String endTime = nowTimeString;


            ServiceCommListener SCL = new ServiceCommListener(context,intent);
            JSONObject timeRange = new JSONObject();
            JSONObject postParam = new JSONObject();
            try {
                timeRange.put("start",startTime);
                timeRange.put("end",endTime);

                postParam.put("userid",username);
                postParam.put("password",password);
                postParam.put("tags",JSONObject.NULL);
                postParam.put("timerange",timeRange);
                postParam.put("isrowcheckonly",true);
            } catch (JSONException e) {
                Log.e("BroadReceive",e.getMessage());
            }

            CustomWebRequest webRequest = new CustomWebRequest("https://fabula-node.herokuapp.com/usersfeeditems",SCL,postParam);
            webRequest.PostRequest();
        }

    }
}