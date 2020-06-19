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

package com.google.sps;

import java.util.ArrayList;
import java.util.List;
import java.util.Collection;
import java.util.Comparator;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;

/** TODO: */
public final class FindMeetingQuery {
  /**
   * TODO:
   * @param events
   * @param request
   * @return
   */
  private List<Event> getRelevantEvents(Collection<Event> events, MeetingRequest request){
    List<Event> relevantEvents = new ArrayList<>();
    Iterator<Event> iter = events.iterator();
    Event currEvent;
    Collection<String> requestedAttendee = request.getAttendees();
    Set<String> meetingAttendee = new HashSet<>();
    while(iter.hasNext()){
      currEvent = iter.next();
      meetingAttendee.addAll(currEvent.getAttendees());
      meetingAttendee.retainAll(requestedAttendee);
      if(meetingAttendee.size() != 0){
        relevantEvents.add(currEvent);
      }
      meetingAttendee.clear();
    }

    return relevantEvents;
  }

  public static final Comparator<Event> SORT_EVENT_BY_START = new Comparator<Event>() {
    @Override
    public int compare(Event a, Event b) {
      return Long.compare(a.getWhen().start(), b.getWhen().start());
    }
  };

  private boolean checkTimeRange (int start, int end, long duration) {
    if (((long)(end - start)) < duration) {
      return false;
    }
    return true;
  }

  /**
   * TODO:
   * @param events
   * @param request
   * @return
   */
  public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {
    List<Event> relevantEvents = getRelevantEvents(events, request);
    relevantEvents.sort(SORT_EVENT_BY_START);

    int start = TimeRange.START_OF_DAY;
    int end = TimeRange.START_OF_DAY;
    long duration = request.getDuration();
    int currStart;
    TimeRange prevTimeRange = TimeRange.fromStartDuration(0, 0);
    TimeRange currTimeRange;
    Event prevEvent = null;
    Collection<TimeRange> possibleTime = new ArrayList<>();
    
    for(Event currEvent: relevantEvents) {
      currTimeRange = currEvent.getWhen();
      currStart = currTimeRange.start();
      if (prevEvent == null && currStart != TimeRange.START_OF_DAY) {
        end = currStart;
      }
      else if(prevTimeRange.contains(currTimeRange)){
        continue;
      }
      else if(prevTimeRange.overlaps(currTimeRange)){
        start = currTimeRange.end();
      }
      else{
        end = currStart;
      }

      if(checkTimeRange(start, end, duration)){
        possibleTime.add(TimeRange.fromStartEnd(start, end, false));
      }
      start = currTimeRange.end();
      prevEvent = currEvent;
      prevTimeRange = currTimeRange;
    }
    if(checkTimeRange(start, TimeRange.END_OF_DAY, duration)){
      possibleTime.add(TimeRange.fromStartEnd(start, TimeRange.END_OF_DAY, true));
    }

    return possibleTime;
  }
}
