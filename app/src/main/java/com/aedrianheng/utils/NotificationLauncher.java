package com.aedrianheng.utils;

import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.support.v4.app.NotificationCompat;

import com.adrianheng.fabulav4.R;

/**
 * Created by Adrian on 21/5/2015.
 */
public class NotificationLauncher {
    Intent intent;
    Context context;
    int notifyID;

    String title;
    String message;

    //to launch a notification, use this constructor
    public NotificationLauncher(Intent intent, Context context, String title, String message, int notifyID){
        this.intent = intent;
        this.context = context;
        this.notifyID = notifyID;

        this.title = title;
        this.message = message;
    }

    //otherwise, if you only want to cancel a notification, use this one
    public NotificationLauncher(int notifyID, Context context){
        this.context = context;
        this.notifyID = notifyID;
    }


    public void cancelNotification(){
        //notification manager is what will launch our notifications
        NotificationManager mNotificationManager =
                (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);


        // having a notifyID lets us update this later on if we need to
        mNotificationManager.cancel(notifyID);
    }


    public void launchNotification(){
        // what our notification will display
        NotificationCompat.Builder mBuilder = new NotificationCompat.Builder(context)
                                                        .setSmallIcon(R.drawable.alert_icon)
                                                        .setContentTitle(title)
                                                        .setContentText(message);

        // create a pending intent to wrap our intent for the notification
        PendingIntent pendingIntent = PendingIntent.getActivity(context, 1, intent, PendingIntent.FLAG_CANCEL_CURRENT);
        mBuilder.setContentIntent(pendingIntent);

        //notification manager is what will launch our notifications
        NotificationManager mNotificationManager =
                (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);


        // having a notifyID lets us update this later on if we need to
        mNotificationManager.notify(notifyID, mBuilder.build());
    }

}
