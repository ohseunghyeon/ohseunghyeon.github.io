---
title: Summary about Bing Ads API
date: 2019-11-14T01:04:08.291Z
description: Bing Ads API에 대한 정리
category: study
---

Bing Ads는 옛날 명칭이며 지금은 Microsoft Advertising 이다.

## Bing Ads 개괄

### 어떻게 동작하는가

1. 유저가 어떤 키워드로 검색
2. 해당 키워드가 광고와 매치되면, 광고가 검색 결과의 상단 혹은 옆에 나타남
3. 유저가 광고를 클릭하여 전화를 걸거나, 웹사이트에 방문하거나, 매장으로 찾아감

### MS Advertising이 광고될 수 있는 범위

- 빙은 미국에서 데스크탑 검색의 36.2퍼센트를 차지한다.
- 매달 전 세계에서 112억 건의 검색이 발생 (데스크탑 기준).
- 구글이 도달하지 못하는 494억의 검색에 도달할 수 있다.
- Microsoft Search Network에서만 가능한 검색 중 27퍼센트에서 광고 클릭이 발생
- 미국에서는 1억 1600만 명이 Microsoft Search Network만 사용한다. (데스크탑)

### Microsoft Search Network란

빙, 파트너 사이트, 윈도우 10, 코타나, 오피스, 써드파티 플랫폼, 파트너쉽 등을 아우르는 말

### 광고가 나타나는 곳은?

빙, 야후, MSN 검색 결과

### 광고가 나타나는 위치는 어떻게 정해질까?

Microsoft Advertising은 pay-per-click(PPC) 광고 시스템을 가지고 있다. 기본적으로 bidding(입찰) 방식으로 광고의 위치가 결정된다. 즉, '신발'이라는 키워드에 광고를 달고 싶을 경우 이 키워드로 광고를 하는 다른 광고자가 입찰한 금액과 내 입찰 금액이 비교되어 위치가 결정된다.

다음은 광고의 위치가 결정되는 매커니즘이다.

1. 검색 키워드가 당신의 광고와 얼마나 관련성이 있는지
2. 당신의 입찰가가 다른 입찰가와 비교하여 어떤지 (많은지를 얘기하는 것 같다. 그러나 사이트에 많을 수록 좋은 위치에 나온다는 얘기는 없다.)
3. 당신의 광고가 과거에 얼마나 영향력이 있었는지, 얼마나 많이 클릭되었는지

광고가 이 매커니즘을 잘 만족할수록 상위 위치에 광고가 된다.

### Microsoft Advertising으로 더 많은 사람 끌어모으기

- 예산과 입찰가를 전략적으로 살펴라. 만약 광고가 계속 정지된다면, 예산 한도가 너무 낮게 설정된 것이다. 경쟁적인 입찰가가 광고를 좋은 위치에 머물게 하고, 이에 사람들이 더 많이 보고, 클릭한다.
- 장소나, 기기(컴퓨터, 모바일, 태블릿)의 타겟을 확장해라.
- 네 광고와 웹사이트가 입찰하려는 키워드와 관련이 있는지 확인해라.

[출처](https://ads.microsoft.com/?signout=true&ccuisrc=4)

## Overview

### Bing Ads API를 누가 써야할까

- 당신이 광고 매니저인데, 당신의 내부 재고 관리나 전환 추적 시스템과 결합하고 싶어서
- 광고 관리 솔루션을 개발하고 싶어서
- 광고 에이전시인데, 여러 광고주를 위해 광고 캠패인을 관리하고 싶어서

### 광고가 어디에 나올까

빙, AOL, 야후나 야후의 검색엔진을 사용하는 사이트의 검색 결과 페이지. 광고의 키워드와 검색 키워드에 따라서 나옴.

### 광고를 풍성하게 하는 법

[Ad Extensions](https://docs.microsoft.com/en-us/advertising/guides/ad-extensions?view=bingads-13)를 사용해라. Ad Extensions는 전화, 이미지, 장소, 가격, 리뷰 등 다양하다.

Microsoft Shopping Campaigns도 있다. 이는 Microsoft Merchant Center Store에 너의 상품을 등록할 수 있게 해준다. Microsoft Shopping Campaigns의 product ads는 상품에 대한 디테일, 이미지, 선택적인 홍보성 문구를 포함할 수 있다. product catalog를 만들 후에, 이를 Microsoft Advertising Content API나 FTP로 제출할 수 있다. For more Information, please see [Product Ads](https://docs.microsoft.com/en-us/advertising/guides/product-ads?view=bingads-13)

### 타겟이 되는 사람에게 광고를 보여주기

데스크탑과 모바일 중 어떤 것에 치중해서 보여줄지, 어떤 반경으로 장소를 설정해 보여줄지, 나이, 성별, 특정 날짜 또는 주에 보여줄지 설정할 수 있다.

### 캠패인 최적화하기

Bing Ads API [Ad Insight](https://docs.microsoft.com/en-us/advertising/ad-insight-service/ad-insight-service-reference?view=bingads-13) 서비스는 historical performance, 웹 페이지 데이터, 인구학적 데이터를 제공하고, 입찰가를 추천해준다.

## Frequently Asked Questions

### Get Started

Q. Bing Ads API 쓰려면 뭐가 필요하죠?

Microsoft Advertising 계정을 생성하고, 당신의 developer token을 Developer Portal의 Account Tab에서 획득하세요.

Q. SDK가 지원되는 언어는?

.NET, Java, PHP, Python

다른 언어는 지원할 계획 없다.

Q. API version은 뭘 써야하죠?

늘 최신 버전을 쓰세요.

### Feature Availability

Q. Bulk나 Campaign Management API 중 뭐를 써야 하나요?

Bulk가 추천됨. 여러 개의 Ads를 생성하거나 업데이트할 때 좋다. Bulk에 없는 API는 Campaign Management API를 써라.

Q. 어떤 API performance reports가 가능하고, 언제 내 데이터를 볼 수 있나요?

모두 가능해요.

데이터는 유저가 광고를 클릭하고 최대 2시간(컨버전은 3시간) 걸리고 reporting이 가능해져요.

### OAuth

Q. 사용자의 인터렉션이 없는 애플리케이션을 운영하고 싶은데요. Microsoft Advertising credentials를 사용하기 위한 허가를 얻는 절차 없이 어떻게 인증할 수 있죠?

그렇게 하기 위해서는 최소한 한 번은 웹 앱을 통해서 동의를 얻는 절차를 거쳐야 합니다. 반복되거나 장기적인 인증을 위해서는 [authorization code grant flow](https://docs.microsoft.com/en-us/advertising/guides/authentication-oauth)를 따라 access token과 refresh token을 얻으세요. 그리고 가장 최신의 refresh token으로 새로운 access token과 refresh token을 얻을 수 있습니다. 만약 Microsoft Account의 주인이 계정 복구, 비밀번호 변경 또는 앱의 권한 삭제를 실시한 경우 다시 요청해야 합니다.

## 파이썬으로 Bing Ads API 사용하기

Bing Ads API의 인증은 [OAuth 2.0](https://tools.ietf.org/html/rfc6749) 방식으로 이뤄진다. 즉, Microsoft의 계정을 사용하여 Asure에서 생성한 App에게 제한된 권한을 준다. 그럼 앱이 권한을 받았다는 뜻으로 refresh token이 생성된다. 이 refresh token을 잃어버리면 권한을 잃어버린 것과 같다.

파이썬 SDK의 code example에서는 자동으로 해당 토큰을 파일로 저장한다. 그럼 이 토큰을 바탕으로 SDK의 각종 서비스를 생성하여 사용하면 된다. 나의 경우 account, campaign, ad group, ads를 생성, 수정, 삭제하기 위해 SDK를 사용하였으며, 대부분의 유스케이스가 비슷할 것이다.

... 계속

<!-- 아래는 각 

### Authentication

```python

```

### Account

### Campaign

### Ad group

### Budget and Bid Strategies

Ads가 돌아가게 하기 위해서는 Campaign에 예산이 필요하다. 또한 입찰 전략(Bid Strategies)을 설정해야 하고, 선택적으로 keyword에도 설정할 수 있다.

#### Budget Types

예산(Budget)은 campaign에 사용할 돈을 말한다. 캠패인에 daily budget을 설정할 수 있는데, 예산에 도달하면 해당 월의 마지막 날까지 광고가 일시적으로 중지된다. 예산은 목표치다. 실제로 사용되는 광고비는 예산보다 높거나 낮을 수 있고, 이는 다양한 변수에 의해 발생할 수 있다.

shared budget은 동일한 어카운트 내에서 캠페인마다 daily budget을 설정할 수 있게 해준다.

### Report

#### ReportAggregation

- Summary: 
- Hourly: 0 - 23로 hour가 표현되며, 오후 1시 ~ 오후 2시 사이에 발생한 이벤트의 경우 MM/DD/YYYY 12:00:00 AM|13로 통합되어 하나의 row로 표시. 여러 날짜를 보는 거라면, 각 날짜의 각 시가 하나의 row로 표시된다.
- Daily: 각 날짜로 데이터가 통합
- Weekly: 각 주를 하나의 row로 통합
- Monthly: 각 달을 하나의 row로 통합
- Yearly: 각 년도를 하나의 row로 통합
- HourOfDay: 0 - 23으로 hour를 표현, Hourly와 달리 여러 날짜에 대한 특정 시간대가 한 줄로 표현된다. 
- DayOfWeek: 일요일은 1, 토요일은 7로 해당 기간 동안 특정 요일을 모두 합산하여 보여준다. 특정 기간 동안 일요일이 3 번 있었을 경우 이 3번의 일요일을 하나의 row로 합산하여 표시.
- WeeklyStartingMonday: Weekly와 동일하지만 시작 날짜가 월요일이고 끝 날짜가 일요일이다.

-->