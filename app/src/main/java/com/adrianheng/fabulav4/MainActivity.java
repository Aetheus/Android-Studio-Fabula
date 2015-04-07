package com.adrianheng.fabulav4;

import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;

import com.aedrianheng.utils.CustomWebRequest;
import com.aedrianheng.utils.SetTextViewListener;


public class MainActivity extends ActionBarActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);


        SetTextViewListener tvListener = new SetTextViewListener(this,"howdy",R.id.mainTextView);


        //CustomWebRequest dler = new CustomWebRequest("http://hmkcode.appspot.com/rest/controller/get.json",tvListener);
        //dler.downloadFile();

        CustomWebRequest dler = new CustomWebRequest("https://fabula-node.herokuapp.com/greet",tvListener);
        dler.PostRequest();
    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
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
