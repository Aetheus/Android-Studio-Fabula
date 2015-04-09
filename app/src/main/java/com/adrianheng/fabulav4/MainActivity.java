package com.adrianheng.fabulav4;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.EditText;
import android.widget.Toast;

import com.aedrianheng.utils.CustomWebRequest;
import com.aedrianheng.utils.IntentStarterListener;
import com.aedrianheng.utils.LoginIntentStarterListener;
import com.aedrianheng.utils.SetTextViewListener;

import org.apache.http.entity.StringEntity;
import org.json.JSONException;
import org.json.JSONObject;


public class MainActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);


    }



    public void onClickSubmitButton(View view){
        //get the username and password
        EditText usernameField = (EditText) findViewById(R.id.loginUsername);
        EditText passwordField = (EditText) findViewById(R.id.loginPassword);

        String username = usernameField.getText().toString();
        String password = passwordField.getText().toString();

        //our setText callback listener
        SetTextViewListener tvListener = new SetTextViewListener(this,"howdy",R.id.mainTextView);

        //our intentStarter callback listener
        Intent landingPageIntent = new Intent(this,LandingActivity.class);
        landingPageIntent.putExtra("USERNAME", username);
        landingPageIntent.putExtra("PASSWORD", password);
        LoginIntentStarterListener isListener = new LoginIntentStarterListener(this, landingPageIntent);

        //the parameters we want to send to our POST request, encapsulated as JSON
        JSONObject jsonobj = new JSONObject();
        try {
            jsonobj.put("username", username);
            jsonobj.put("password", password);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        CustomWebRequest dler = new CustomWebRequest("https://fabula-node.herokuapp.com/greet",tvListener,jsonobj);
        dler.addListener(isListener);

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
