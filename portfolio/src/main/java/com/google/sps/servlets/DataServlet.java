// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps.servlets;

import java.io.IOException;
import java.util.ArrayList;
import com.google.gson.Gson;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Servlet that returns some example content. TODO: modify this file to handle comments data */
@WebServlet("/data")
public class DataServlet extends HttpServlet {

    private int maxDisplay = 5;

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        ArrayList<String> list = new ArrayList<>();
        
        int counter = 0;

        Query query = new Query("Entity").addSort("timestamp", SortDirection.DESCENDING);

        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        PreparedQuery results = datastore.prepare(query);
        
        for(Entity entity: results.asIterable()) {
            if(counter >= maxDisplay) {
                break;
            }
            String comment = (String) entity.getProperty("comment");
            list.add(comment);
            counter++;
        }

        response.setContentType("text/html;");
        String json = new Gson().toJson(list);
        response.getWriter().println(json);
    }

    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String comment = getComment(request, "new-comment", "");
        
        if (!comment.isEmpty()) {
            Entity commentEntity = new Entity("Entity");
            commentEntity.setProperty("comment", comment); 
            long timestamp = System.currentTimeMillis();
            commentEntity.setProperty("timestamp", timestamp);

            DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
            datastore.put(commentEntity); 
        }

        String maxDisplayStr = request.getParameter("max-display");
        try {
            maxDisplay = Integer.parseInt(maxDisplayStr);
        } catch (NumberFormatException e) {
            maxDisplay = 5;
        }

        response.sendRedirect("/index.html");
    }

    private String getComment(HttpServletRequest request, String name, String defaultValue) {
        String comment = request.getParameter(name);

        if (comment == null) {
            comment = defaultValue;
        }
        return comment;
    }


  
}
