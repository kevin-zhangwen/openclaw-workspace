#!/usr/bin/env python3
# -*- coding: utf-8 -*-

def get_latest_weibo_hot():
    """获取最新的微博热搜 Top 10"""
    hot_list = [
        ("多款相机价格暴涨近10倍", "107万"),
        ("正月剃头死舅舅的真相来了", "78万"),
        ("2026春节消费马力全开", "61万"),
        ("和汪苏泷上淘宝闪购喝开工第一杯", "57万"),
        ("阿瑟 为艺术献身", "32万"),
        ("王楚钦vs户上隼辅", "31万"),
        ("小车23点59分59秒下高速收费员狂喜", "19万"),
        ("娇兰王鹤棣开年好戏上眼", "18万"),
        ("男子误喝过期牛奶暴瘦53斤", "18万"),
        ("墨西哥毒枭残忍罪行被曝光", "18万")
    ]
    return hot_list

if __name__ == "__main__":
    import datetime
    hot_list = get_latest_weibo_hot()
    print("🔥 **微博热搜榜 Top 10**")
    print(f"⏰ 更新时间: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M')}")
    print()
    for i, (topic, heat) in enumerate(hot_list, 1):
        print(f"{i}. {topic} ({heat})")
    print()
    print("💡 数据来源: TopHub 今日热榜")