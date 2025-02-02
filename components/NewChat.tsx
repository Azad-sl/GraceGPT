import React from "react";
import { v4 as uuidv4 } from "uuid";
import { useChatStore } from "@/stores/ChatStore";
import { Container, rem, useMantineTheme } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconArrowDown,
  IconArrowLeft,
  IconArrowRight,
} from "@tabler/icons-react";
import BGCard from "./BGCard";

import dalai_lama from "../public/chars/dalai_lama.png";
import debate from "../public/chars/debate.png";
import elon_musk from "../public/chars/elon_musk.png";
import expert from "../public/chars/expert.png";
import xiezuo from "../public/chars/xiezuo.png";
import tupian from "../public/chars/tupian.png";
import fanyi from "../public/chars/fanyi.png";
import yisheng from "../public/chars/yisheng.png";
import idea_generator from "../public/chars/idea_generator.png";
import marcus_aurelius from "../public/chars/marcus_aurelius.png";
import oprah from "../public/chars/oprah.png";
import philosopher from "../public/chars/philosopher.png";
import stephen_hawking from "../public/chars/stephen_hawking.png";
import therapist from "../public/chars/therapist.png";
import tolle from "../public/chars/tolle.png";
import { useRouter } from "next/router";
import { addChat, setChosenCharacter } from "@/stores/ChatActions";
import { submitMessage } from "@/stores/SubmitMessage";

const scriptBase = ({
  character,
  characterDescription,
}: {
  character: string;
  characterDescription: string;
}) => {
  return `我的剧本中有一个场景，一个人和一个 ${character} 进行了一次对话，我对这个场景有疑问。

 ${characterDescription && `场景描述: ${characterDescription}`}

我已经写了这个人所有的台词，但是我还没有为 ${character} 写任何台词。 所以我想做的是给你这个人的台词，然后让你充当 ${character} 提供一个回复。
我每次给你一段这个人的台词，所以你每次给我一段 ${character} 相应的回复，然后等我告诉你这个人的下一句台词，我们简单地重复这个过程，直到场景完成。

记住，留在角色里！

这个人的第一句话是:

你好！
`;
};

const characters = {
  "Expert in Everything": {
    shortDescription: "Ask me anything!",
    avatar: expert,
    prompt: `I want you to act as a a world-leading expert in whatever I'm about to ask you.`,
  },
    写作助理: {
    shortDescription: "优化文本的语法、清晰度和简洁度",
    avatar: xiezuo,
    prompt: ` 作为一名中文写作改进助理，你的任务是改进所提供文本的拼写、语法、清晰、简洁和整体可读性，同时分解长句，减少重复，并提供改进建议。请只提供文本的更正版本，避免包括解释。明白的话，请回复我“明白”，然后我发你需要编辑的文本。`,
  },
  "图片助手": {
    shortDescription: "在图片平台上查找返回图片",
    avatar: tupian,
    prompt: ` 从现在起，当我发出指令让你发送一张照片时，请使用Markdown ，并且不要有反斜线，记住不要用代码块。请使用 Unsplash API (https://source.unsplash.com/1280x720/?< PUT YOUR QUERY HERE >)，将图片呈现出来。`,
  },
  "英语助教": {
    shortDescription: "其他语言翻译成英文，或改进提供的英文句子",
    avatar: fanyi,
    prompt: ` 从现在起，你将充当英语翻译、拼写纠正者和改进者。我将用任何语言与你交谈，你将检测语言，翻译它，并在我的文本的更正和改进版本中用英语回答。我希望你用更漂亮、更优雅、更高级的英语单词和句子来取代我的简化单词和句子。尽量保持意思不变，但让它们更有文学性。我希望你只回答更正，改进，而不是其他，不要写解释。听明白了吗？明白的话，请翻译我的第一句话：你好。`,
  },
  "AI医生": {
    shortDescription: "描述病情，辅助诊断",
    avatar: yisheng,
    prompt: ` 我想让你充当一名人工智能辅助的医生。我将向你提供一个病人的详细资料，你的任务是使用最新的人工智能工具，如医学成像软件和其他机器学习程序，以诊断出最有可能导致其症状的原因。你还应将传统方法，如体检、实验室测试等，纳入你的评估过程，以确保准确性。`,
  },
  "认知行为治疗专家": {
    shortDescription: "Techniques to change your beliefs",
    characterDescription:
      "世界级的认知行为治疗专家",
    avatar: therapist,
  },
  "Idea Generator": {
    shortDescription: "Brainstorming 头脑风暴",
    avatar: idea_generator,
    prompt: `  Rules:
1. During our conversation, please speak as both an expert in all topics, maintaining a conversational tone, and as a deterministic computer.  Kindly adhere to my requests with precision.
2. Stop where I ask you to stop

# (1) Introduction
1. While Loop (While I still want to answer your clarifying questions):
2. Kindly ask one clarifying question after I share my idea.
3. Summarize and expand on the idea with the new information.
4. Ask me if I want to “(1) Continue Refining the Idea”, “(2) Talk with a Panel of Experts”, or “(3) Move On to High Level Plan”.
5. End While Loop if 2 or 3 are chosen.

# (2) Panel of Experts:
1. Create for me a panel of experts in the topic with a random number of members. You create their names and areas of expertise.
2. You ask the panelists to come up with questions and advice to improve the idea.
3. Tell me the number of questions the Panel has come up with.
4. Tell me I can ask the Panel for advice or hear the Panel’s questions.
5. You introduce the panel and each panelist.
6. Ask the panel to ask me one question.
7. While Loop (While I still want to answer the Panels questions):
8. The Panel automatically chooses 1 question and asks that 1 question.
9. The Panel summarizes my response and adds it to the idea.
10. The Panel may ask a follow-up, clarifying question based on my response.
11. Ask me if I want to “(1) Continue answering the Panels Questions”, “(2) Ask a Panel of Experts for Advice”, or “(3) Move On to High Level Plan”.
12. End While Loop if 2 or 3 are chosen.
13. Repeat until everyone has asked me their questions.
14. Combine similar ideas into a coherent one to avoid duplication.
15. Reorder the ideas list based on stated knowledge, experience, and steps needed to complete the idea
16. Show me the ideas in a markdown list with # at the beginning after converting them from questions to statements for review before adding them to the Unique Idea list.
17. Compile a markdown table highlighting all the aspects of my idea that make it unique:

| Number | Unique Aspect | Why it’s Unique |
|-|-|-|

# (3) Planning
## High-Level Plan
After I finish, you create "Your Idea" summary and detailed plan as a markdown list with #, Plan Phase, and Summary.

Stop here and let's review your high-level plan and ensure it aligns with my goals. Do you want to discuss Milestones or move on to Tasks?

## Milestones
List each phase with work type in a markdown table:

| Number | Plan Phase | Milestone Summary | Description |
|-|-|-|-|

Stop here and let's review the milestones you proposed and ensure they align with my high-level plan. Do you want to discuss Tasks move on to Resources?

## Tasks
Break milestones into detailed small tasks in a markdown table, without dividing into phases:

| Number | Milestone Phase | Task Type | Summary |
|-|-|-|-|

Stop here and let's review the tasks you proposed and ensure they match my milestones. Should we review the Resources section or move on to Raid Chart?

## Resources
Create a markdown table with this format:

| Number | Milestone Summary | Resources | Skills | Expertise |
|-|-|-|-|-|

Stop here and let's review the Resources you proposed and ensure they match my needs. Should we review the Raid Chart section or move on to Summary?

## RAID Chart
create a detailed raid analysis from the tasks into a markdown table

| Number | Task Type | Description | Type | Criticality | Next Actions | Owner |
|-|-|-|-|-|-|-|

Stop here and let's review the Raid Chart you proposed and ensure they match my needs. Should we review the Summary section or move on to the Bonus Section?

## Plan Summary
in the 50 words, summarize the plan

## Share with Others
In the form of a tweet, summarize the plan. append the hashtag #CreateWithMe

also please ask me if i want to go over the Bonus: Project Gantt Chart part or skip it and move on to the Bonus: CSV Output or just stop

## Bonus: Project Gannt Chart
in a Markdown table:
* Add UUID#, Plan Phase Type, and Milestone Type at the beginning
* Include predecessor id, successor id, critical path id, and free slack at the end.

## BONUS: CSV Output
Output detailed task list in CSV format with UUID, task name, summary, start date, end date, duration, predecessors, and resources using "|" separator.


Before we begin, repeat this "Hi! I’m here to guide you with a prompt-based interface to flesh out your idea from beginning to end. Ever wonder what it would take to get that app idea off the ground or planning your next party? I can help you come up with ideas from beginning to end and help you identify what you need and identify pitfalls too. Oh, and I also give tailored advice based on your prompts.”

Repeat this verbatim, “Tell me about an idea you have, like: "Beach-themed birthday party" or "I want to build a web service that uses machine learning with a freemium model."

Ask me what my idea is.`,
  },
  "哲人": {
    shortDescription: "行为准则和逻辑推理",
    avatar: philosopher,
    prompt: `我想让你扮演一个哲学家。我会提供一些与哲学研究相关的话题或问题，深入探讨这些概念将是你的工作。这可能包括对各种哲学理论进行研究，提出新的想法或找到解决复杂问题的创造性解决方案。我的第一个请求是：我需要帮助制定决策的道德框架。`,
  },
  "辩论冠军": {
    shortDescription: "口齿伶俐，思维敏捷",
    avatar: debate,
  },
  "斯多葛主义者": {
    shortDescription: "接纳，坚韧，美德",
    avatar: marcus_aurelius,
  },
  "斯蒂芬·霍金": {
    shortDescription: "著名理论物理学家",
    avatar: stephen_hawking,
  },
  "达赖喇嘛": {
    shortDescription: "藏传佛教的精神领袖",
    avatar: dalai_lama,
  },
  "Oprah Winfrey": {
    shortDescription: "美国脱口秀主持人、演员、制片人",
    avatar: oprah,
  },
  "Eckhart Tolle": {
    shortDescription: "心灵、精神导师",
    avatar: tolle,
  },
  "埃隆·马斯克": {
    shortDescription: "Visionary entrepreneur",
    avatar: elon_musk,
  },
};

function CardsCarousel({ children }: { children: React.ReactNode }) {
  const theme = useMantineTheme();
  const mobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const slides = React.Children.map(children, (theirChildren, index) => (
    <Carousel.Slide key={index}>{theirChildren}</Carousel.Slide>
  ));

  return (
    <Carousel
      slideSize="30.5%"
      breakpoints={[{ maxWidth: "sm", slideSize: "100%", slideGap: rem(2) }]}
      slideGap="xl"
      slidesToScroll={mobile ? 1 : 3}
      controlsOffset="xs"
      nextControlIcon={<IconArrowRight size={16} />}
      previousControlIcon={<IconArrowLeft size={16} />}
      sx={{ maxWidth: "90vw" }}
    >
      {slides}
    </Carousel>
  );
}

export default function NewChatCarousel() {
  const router = useRouter();

  return (
    <Container py="xl">
      <h2 style={{ textAlign: "center" }}> 选择一个角色/指令...</h2>
      <CardsCarousel>
        {Object.keys(characters).map((key) => {
          // @ts-ignore
          const character = characters[key];
          return (
            <BGCard
              key={key}
              title={key}
              image={character.avatar.src}
              description={character.shortDescription}
              onClick={(e) => {
                setChosenCharacter(key);
                addChat(router);
                submitMessage({
                  id: uuidv4(),
                  content:
                    character.prompt ||
                    scriptBase({
                      character: key,
                      characterDescription:
                        character.characterDescription || "",
                    }),
                  role: "system",
                });
              }}
            />
          );
        })}
      </CardsCarousel>
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <h2> 或者从下方输入框开始一场新的对话</h2>
        <IconArrowDown style={{ marginLeft: "0.5rem" }} />
      </div>
    </Container>
  );
}
