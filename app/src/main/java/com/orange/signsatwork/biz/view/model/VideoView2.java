package com.orange.signsatwork.biz.view.model;

/*
 * #%L
 * Signs at work
 * %%
 * Copyright (C) 2016 Orange
 * %%
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as
 * published by the Free Software Foundation, either version 2 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public
 * License along with this program.  If not, see
 * <http://www.gnu.org/licenses/gpl-2.0.html>.
 * #L%
 */

import com.orange.signsatwork.biz.persistence.model.SignViewData;
import com.orange.signsatwork.biz.persistence.model.VideoViewData;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class VideoView2 implements ComparableVideo {
  private long signId;
  private String signName;
  private Date createDate;
  private long videoId;
  private String url;
  private String pictureUri;
  private boolean videoCreateAfterLastDateConnection;
  private boolean videoHasComment;

  public VideoView2(VideoViewData videoViewData, boolean videoHasComment, boolean createdAfterLastConnection) {
    signId = videoViewData.signId;
    signName = videoViewData.signName;
    createDate = videoViewData.createDate;
    videoId = videoViewData.videoId;
    url = videoViewData.url;
    pictureUri = videoViewData.pictureUri;
    videoCreateAfterLastDateConnection = createdAfterLastConnection;

    this.videoHasComment = videoHasComment;
  }

  @Override
  public long videoId() {
    return videoId;
  }

  @Override
  public boolean createdSinceLastConnexion() {
    return videoCreateAfterLastDateConnection;
  }

  @Override
  public boolean modifiedSinceLastConnexion() {
    return videoHasComment;
  }

  public static boolean createdAfterLastConnection(Date createDate, Date lastConnection) {
    return (lastConnection != null) && createDate.compareTo(lastConnection) >= 0;
  }
}
