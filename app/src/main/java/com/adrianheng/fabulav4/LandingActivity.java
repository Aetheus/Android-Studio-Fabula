package com.adrianheng.fabulav4;

import android.content.Intent;
import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.TextView;


public class LandingActivity extends ActionBarActivity {

    protected String username;
    protected String password;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_landing);

        Intent ourStarter = getIntent();
        this.username = ourStarter.getStringExtra("USERNAME");
        this.password = ourStarter.getStringExtra("PASSWORD");

        TextView mainMessage = (TextView) findViewById(R.id.landingMessage);
        mainMessage.setText(username + " : " + password);
    }

    public void goToScraper(View view){
        Intent intent = new Intent(this,ScraperActivity.class);
        intent.putExtra("USERNAME", username);
        intent.putExtra("PASSWORD", password);
        this.startActivity(intent);
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
