export interface GuidedStep {
  title: string
  explanation: string
  code: string
  expectedOutput: string
}

export interface GuidedExampleData {
  sectionId: string
  title: string
  description: string
  steps: GuidedStep[]
  packages: string[]
}

export const guidedExamples: Record<string, GuidedExampleData> = {
  // ═══════════════════════════════════════════
  // CH1: Python 기초와 데이터 다루기
  // ═══════════════════════════════════════════

  'python-ml-practice-ch1-s1': {
    sectionId: 'python-ml-practice-ch1-s1',
    title: 'Python 기본 문법 따라하기',
    description: '프로그래밍의 기본! 변수, 조건문, 반복문을 하나씩 따라해 봅시다. 각 단계를 실행해보면서 결과를 확인하세요 🚀',
    packages: [],
    steps: [
      {
        title: '1단계: 변수는 이름표 붙은 상자',
        explanation: '📦 변수는 값을 담는 상자예요. 상자에 이름표를 붙이고 안에 원하는 것을 넣을 수 있어요. 이름(문자), 나이(숫자), 키(소수점 숫자) 등 다양한 종류를 담을 수 있답니다!',
        code: `name = "민수"
age = 12
height = 152.5

print("이름:", name)
print("나이:", age, "살")
print("키:", height, "cm")`,
        expectedOutput: '이름: 민수\n나이: 12 살\n키: 152.5 cm',
      },
      {
        title: '2단계: 조건문으로 판단하기',
        explanation: '🤔 조건문은 "만약 ~라면" 이라는 뜻이에요. 시험 점수가 60점 이상이면 "합격", 아니면 "불합격"을 알려주는 프로그램을 만들어 볼까요?',
        code: `score = 85

if score >= 60:
    print(score, "점: 합격입니다! 🎉")
else:
    print(score, "점: 아쉽지만 불합격입니다")

print("수고하셨습니다!")`,
        expectedOutput: '85 점: 합격입니다! 🎉\n수고하셨습니다!',
      },
      {
        title: '3단계: 반복문으로 여러 번 실행하기',
        explanation: '🔄 반복문은 같은 일을 여러 번 해주는 마법이에요! "1번째, 2번째, ..." 이렇게 숫자를 세면서 반복할 수 있어요.',
        code: `for i in range(1, 6):
    print(i, "번째 반복!")

print("반복 끝!")`,
        expectedOutput: '1 번째 반복!\n2 번째 반복!\n3 번째 반복!\n4 번째 반복!\n5 번째 반복!\n반복 끝!',
      },
    ],
  },

  'python-ml-practice-ch1-s2': {
    sectionId: 'python-ml-practice-ch1-s2',
    title: '함수와 리스트 활용 따라하기',
    description: '함수는 자주 쓰는 코드를 묶어놓은 "요리 레시피"예요. 리스트에서 원하는 것만 골라내는 방법도 배워볼까요? 🍳',
    packages: [],
    steps: [
      {
        title: '1단계: 함수는 요리 레시피',
        explanation: '🍳 함수는 재료(입력)를 넣으면 요리(결과)를 만들어주는 레시피예요! def 라는 키워드로 레시피를 만들고, 이름을 붙여서 언제든 다시 쓸 수 있어요.',
        code: `def add(a, b):
    return a + b

result1 = add(3, 5)
result2 = add(10, 20)

print("3 + 5 =", result1)
print("10 + 20 =", result2)`,
        expectedOutput: '3 + 5 = 8\n10 + 20 = 30',
      },
      {
        title: '2단계: 리스트에서 원하는 것만 골라내기',
        explanation: '🔍 filter는 체로 거르는 것처럼, 조건에 맞는 것만 골라내요! 짝수(2로 나누어 떨어지는 수)만 골라볼까요?',
        code: `numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

evens = list(filter(lambda x: x % 2 == 0, numbers))

print("전체:", numbers)
print("짝수:", evens)`,
        expectedOutput: '전체: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\n짝수: [2, 4, 6, 8, 10]',
      },
      {
        title: '3단계: map으로 한꺼번에 변환하기',
        explanation: '🔄 map은 리스트의 모든 값을 한꺼번에 바꿔줘요! 마치 자판기에 동전을 넣으면 음료수가 나오는 것처럼, 모든 숫자를 2배로 만들어 볼게요.',
        code: `numbers = [1, 2, 3, 4, 5]

doubled = list(map(lambda x: x * 2, numbers))

print("원래:", numbers)
print("2배:", doubled)`,
        expectedOutput: '원래: [1, 2, 3, 4, 5]\n2배: [2, 4, 6, 8, 10]',
      },
    ],
  },

  'python-ml-practice-ch1-s3': {
    sectionId: 'python-ml-practice-ch1-s3',
    title: '데이터 구조 따라하기',
    description: '딕셔너리(사전)를 사용하면 이름표가 붙은 데이터를 깔끔하게 정리할 수 있어요. 학생 데이터를 다루는 방법을 배워봅시다 📚',
    packages: [],
    steps: [
      {
        title: '1단계: 딕셔너리는 사전처럼',
        explanation: '📖 딕셔너리는 영어사전처럼 "단어: 뜻" 형태로 데이터를 저장해요. "이름"이라는 키(열쇠)로 "민수"라는 값을 꺼낼 수 있답니다!',
        code: `student = {
    "이름": "민수",
    "나이": 12,
    "취미": "코딩"
}

print("이름:", student["이름"])
print("나이:", student["나이"])
print("취미:", student["취미"])`,
        expectedOutput: '이름: 민수\n나이: 12\n취미: 코딩',
      },
      {
        title: '2단계: 리스트 속 딕셔너리',
        explanation: '👨‍👩‍👧‍👦 여러 학생의 정보를 리스트에 넣으면, 학급 명부처럼 사용할 수 있어요! 반복문으로 한 명씩 꺼내볼까요?',
        code: `students = [
    {"이름": "민수", "점수": 85},
    {"이름": "지은", "점수": 92},
    {"이름": "서준", "점수": 78},
]

for s in students:
    print(s["이름"], ":", s["점수"], "점")`,
        expectedOutput: '민수 : 85 점\n지은 : 92 점\n서준 : 78 점',
      },
      {
        title: '3단계: 조건으로 데이터 골라내기',
        explanation: '⭐ 리스트 컴프리헨션이라는 강력한 도구로 조건에 맞는 데이터만 쏙쏙 골라낼 수 있어요! 80점 이상인 학생만 찾아봅시다.',
        code: `students = [
    {"이름": "민수", "점수": 85},
    {"이름": "지은", "점수": 92},
    {"이름": "서준", "점수": 78},
    {"이름": "영희", "점수": 95},
]

top = [s for s in students if s["점수"] >= 80]

print("80점 이상 학생:")
for s in top:
    print(" ", s["이름"], s["점수"], "점")`,
        expectedOutput: '80점 이상 학생:\n  민수 85 점\n  지은 92 점\n  영희 95 점',
      },
    ],
  },

  // ═══════════════════════════════════════════
  // CH2: NumPy와 Pandas 마스터
  // ═══════════════════════════════════════════

  'python-ml-practice-ch2-s1': {
    sectionId: 'python-ml-practice-ch2-s1',
    title: 'NumPy 배열 따라하기',
    description: 'NumPy는 숫자를 빠르게 계산해주는 슈퍼 계산기예요! 배열(줄 세운 숫자들)을 만들고 계산하는 방법을 배워봅시다 🔢',
    packages: ['numpy'],
    steps: [
      {
        title: '1단계: 배열은 줄 세운 숫자들',
        explanation: '📏 NumPy 배열은 숫자를 한 줄로 세운 거예요. 일반 리스트보다 훨씬 빠르게 계산할 수 있고, 모든 숫자에 한꺼번에 연산할 수 있어요!',
        code: `import numpy as np

arr = np.array([1, 2, 3, 4, 5])
print("배열:", arr)
print("2배:", arr * 2)
print("합계:", np.sum(arr))`,
        expectedOutput: '배열: [1 2 3 4 5]\n2배: [ 2  4  6  8 10]\n합계: 15',
      },
      {
        title: '2단계: 2차원 배열 = 표 만들기',
        explanation: '📊 2차원 배열은 엑셀 표처럼 행(가로줄)과 열(세로줄)이 있어요. reshape로 1줄 배열을 표 모양으로 바꿀 수 있답니다!',
        code: `import numpy as np

matrix = np.arange(1, 7).reshape(2, 3)
print("2x3 표:")
print(matrix)
print("모양:", matrix.shape)`,
        expectedOutput: '2x3 표:\n[[1 2 3]\n [4 5 6]]\n모양: (2, 3)',
      },
      {
        title: '3단계: 조건으로 값 골라내기',
        explanation: '🎯 배열에서 조건에 맞는 숫자만 쏙쏙 골라낼 수 있어요! 마치 "3보다 큰 것만 보여줘" 라고 말하는 것과 같아요.',
        code: `import numpy as np

arr = np.array([1, 5, 3, 8, 2, 7, 4, 6])
print("전체:", arr)
print("3보다 큰 값:", arr[arr > 3])
print("짝수만:", arr[arr % 2 == 0])`,
        expectedOutput: '전체: [1 5 3 8 2 7 4 6]\n3보다 큰 값: [5 8 7 4 6]\n짝수만: [8 2 4 6]',
      },
    ],
  },

  'python-ml-practice-ch2-s2': {
    sectionId: 'python-ml-practice-ch2-s2',
    title: 'Pandas DataFrame 따라하기',
    description: 'Pandas는 엑셀 같은 표를 다루는 도구예요. 이름, 나이, 점수 같은 데이터를 깔끔한 표로 만들고 분석해봅시다 📋',
    packages: ['pandas'],
    steps: [
      {
        title: '1단계: 표 만들기 = DataFrame',
        explanation: '📋 DataFrame은 엑셀 표와 같아요! 딕셔너리로 열 이름과 데이터를 넣으면 깔끔한 표가 만들어져요.',
        code: `import pandas as pd

df = pd.DataFrame({
    "이름": ["민수", "지은", "서준"],
    "나이": [12, 13, 12],
})
print(df)`,
        expectedOutput: '   이름  나이\n0  민수  12\n1  지은  13\n2  서준  12',
      },
      {
        title: '2단계: 원하는 열만 보기',
        explanation: '👀 표에서 원하는 열(세로줄)만 골라서 볼 수 있어요! 대괄호 안에 열 이름을 넣으면 그 열의 데이터만 보여줘요.',
        code: `import pandas as pd

df = pd.DataFrame({
    "이름": ["민수", "지은", "서준"],
    "나이": [12, 13, 12],
    "점수": [85, 92, 78],
})

print("이름 목록:")
print(df["이름"].tolist())
print("평균 점수:", df["점수"].mean())`,
        expectedOutput: '이름 목록:\n[\'민수\', \'지은\', \'서준\']\n평균 점수: 85.0',
      },
      {
        title: '3단계: 조건으로 행 골라내기',
        explanation: '🔍 조건을 써서 원하는 행(가로줄)만 골라낼 수 있어요! "나이가 12살인 학생만 보여줘" 같은 요청이 가능해요.',
        code: `import pandas as pd

df = pd.DataFrame({
    "이름": ["민수", "지은", "서준", "영희"],
    "나이": [12, 13, 12, 14],
    "점수": [85, 92, 78, 95],
})

young = df[df["나이"] <= 12]
print("12세 이하:")
print(young.to_string(index=False))`,
        expectedOutput: '12세 이하:\n 이름  나이  점수\n민수  12  85\n서준  12  78',
      },
    ],
  },

  'python-ml-practice-ch2-s3': {
    sectionId: 'python-ml-practice-ch2-s3',
    title: '데이터 전처리 따라하기',
    description: '현실의 데이터에는 빈칸(결측치)이 있을 수 있어요. 빈칸을 찾아서 채우는 방법을 배워봅시다 🧹',
    packages: ['pandas', 'numpy'],
    steps: [
      {
        title: '1단계: 빈칸 찾기 = 결측치',
        explanation: '🕳️ 시험지에 이름을 안 쓴 것처럼, 데이터에도 빈칸이 있을 수 있어요. NaN(Not a Number)은 "비어있음"을 의미해요. isna()로 어디가 비었는지 찾아봅시다!',
        code: `import pandas as pd
import numpy as np

scores = pd.Series([85, np.nan, 92, np.nan, 78])
print("점수:", scores.tolist())
print("비어있나?:", scores.isna().tolist())
print("빈칸 수:", scores.isna().sum())`,
        expectedOutput: '점수: [85.0, nan, 92.0, nan, 78.0]\n비어있나?: [False, True, False, True, False]\n빈칸 수: 2',
      },
      {
        title: '2단계: 빈칸 채우기',
        explanation: '✏️ 빈칸을 평균값으로 채울 수 있어요! fillna()라는 함수가 빈칸을 원하는 값으로 채워줍니다.',
        code: `import pandas as pd
import numpy as np

scores = pd.Series([85, np.nan, 92, np.nan, 78])
avg = scores.mean()
print("평균:", avg)

filled = scores.fillna(avg)
print("채운 후:", filled.tolist())`,
        expectedOutput: '평균: 85.0\n채운 후: [85.0, 85.0, 92.0, 85.0, 78.0]',
      },
      {
        title: '3단계: 데이터 타입 바꾸기',
        explanation: '🔄 소수점이 필요 없다면 정수(int)로 바꿀 수 있어요! astype()으로 데이터 타입을 변환합니다.',
        code: `import pandas as pd
import numpy as np

scores = pd.Series([85, np.nan, 92, np.nan, 78])
filled = scores.fillna(scores.mean())

as_int = filled.astype(int)
print("실수:", filled.tolist())
print("정수:", as_int.tolist())`,
        expectedOutput: '실수: [85.0, 85.0, 92.0, 85.0, 78.0]\n정수: [85, 85, 92, 85, 78]',
      },
    ],
  },

  // ═══════════════════════════════════════════
  // CH3: 데이터 시각화
  // ═══════════════════════════════════════════

  'python-ml-practice-ch3-s1': {
    sectionId: 'python-ml-practice-ch3-s1',
    title: '데이터 통계 따라하기',
    description: '데이터를 분석하려면 먼저 기본 통계를 알아야 해요. 평균, 표준편차, 최대/최소를 구하는 방법을 따라해 봅시다 📊',
    packages: ['numpy'],
    steps: [
      {
        title: '1단계: 랜덤 데이터 만들기',
        explanation: '🎲 컴퓨터가 랜덤으로 점수를 만들어줘요! seed(42)를 쓰면 항상 같은 랜덤 숫자가 나와서 결과를 비교할 수 있어요.',
        code: `import numpy as np

np.random.seed(42)
scores = np.random.randint(50, 100, size=10)
print("점수:", scores)
print("학생 수:", len(scores))`,
        expectedOutput: '점수: [51 92 64 54 93 64 89 55 60 60]\n학생 수: 10',
      },
      {
        title: '2단계: 평균과 표준편차',
        explanation: '📐 평균은 모든 값을 더해서 개수로 나눈 거예요. 표준편차는 값들이 평균에서 얼마나 퍼져있는지를 나타내요. 작으면 비슷비슷, 크면 들쑥날쑥!',
        code: `import numpy as np

np.random.seed(42)
scores = np.random.randint(50, 100, size=10)

print("평균:", round(np.mean(scores), 1))
print("표준편차:", round(np.std(scores), 1))`,
        expectedOutput: '평균: 68.2\n표준편차: 15.5',
      },
      {
        title: '3단계: 최대, 최소 찾기',
        explanation: '🏆 최고 점수와 최저 점수를 찾아볼까요? argmax()는 최대값의 위치(몇 번째인지)를 알려줘요!',
        code: `import numpy as np

np.random.seed(42)
scores = np.random.randint(50, 100, size=10)

print("최고 점수:", np.max(scores))
print("최저 점수:", np.min(scores))
print("최고 점수 위치:", np.argmax(scores), "번째")`,
        expectedOutput: '최고 점수: 93\n최저 점수: 51\n최고 점수 위치: 4 번째',
      },
    ],
  },

  'python-ml-practice-ch3-s2': {
    sectionId: 'python-ml-practice-ch3-s2',
    title: '데이터 변환 따라하기',
    description: '점수를 등급(A, B, C, D, F)으로 바꾸고 등급별 인원수를 세는 방법을 배워봅시다 🏷️',
    packages: ['numpy'],
    steps: [
      {
        title: '1단계: 점수를 등급으로',
        explanation: '🏷️ 하나의 점수를 등급으로 바꿔볼까요? 90점 이상이면 A, 80점 이상이면 B, 이런 식으로 if/elif를 사용해요.',
        code: `score = 85

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
elif score >= 60:
    grade = "D"
else:
    grade = "F"

print(score, "점 =", grade, "등급")`,
        expectedOutput: '85 점 = B 등급',
      },
      {
        title: '2단계: 여러 점수 한꺼번에 등급 매기기',
        explanation: '🔄 반복문으로 여러 점수를 한꺼번에 등급으로 바꿀 수 있어요! 각 점수마다 같은 기준을 적용합니다.',
        code: `scores = [95, 82, 67, 73, 58, 91, 88]
grades = []

for s in scores:
    if s >= 90: grades.append("A")
    elif s >= 80: grades.append("B")
    elif s >= 70: grades.append("C")
    elif s >= 60: grades.append("D")
    else: grades.append("F")

for s, g in zip(scores, grades):
    print(s, "점 ->", g)`,
        expectedOutput: '95 점 -> A\n82 점 -> B\n67 점 -> D\n73 점 -> C\n58 점 -> F\n91 점 -> A\n88 점 -> B',
      },
      {
        title: '3단계: 등급별 개수 세기',
        explanation: '📊 Counter를 사용하면 각 등급이 몇 개인지 한눈에 볼 수 있어요! 데이터를 요약하는 첫 걸음이에요.',
        code: `from collections import Counter

grades = ["A", "B", "D", "C", "F", "A", "B"]
counts = Counter(grades)

for grade in ["A", "B", "C", "D", "F"]:
    n = counts.get(grade, 0)
    bar = "#" * n
    print(f"{grade}: {n}명 {bar}")`,
        expectedOutput: 'A: 2명 ##\nB: 2명 ##\nC: 1명 #\nD: 1명 #\nF: 1명 #',
      },
    ],
  },

  'python-ml-practice-ch3-s3': {
    sectionId: 'python-ml-practice-ch3-s3',
    title: 'EDA 통계 분석 따라하기',
    description: '탐색적 데이터 분석(EDA)은 데이터를 이해하는 첫 단계예요. DataFrame의 통계를 구하고 과목 간 관계를 살펴봅시다 🔬',
    packages: ['numpy', 'pandas'],
    steps: [
      {
        title: '1단계: 데이터 요약 보기',
        explanation: '📋 DataFrame을 만들고 기본 통계(평균, 표준편차)를 한눈에 볼 수 있어요!',
        code: `import numpy as np
import pandas as pd

np.random.seed(42)
df = pd.DataFrame({
    "수학": [85, 72, 90, 68, 95],
    "영어": [78, 88, 82, 75, 91],
})

print("평균:")
print(df.mean().round(1).to_string())
print("\\n표준편차:")
print(df.std().round(1).to_string())`,
        expectedOutput: '평균:\n수학    82.0\n영어    82.8\n\n표준편차:\n수학    11.6\n영어     6.7',
      },
      {
        title: '2단계: 과목별 평균 비교',
        explanation: '📊 여러 과목의 평균을 비교하면 어떤 과목이 어려운지 알 수 있어요!',
        code: `import pandas as pd

df = pd.DataFrame({
    "수학": [85, 72, 90, 68, 95],
    "영어": [78, 88, 82, 75, 91],
    "과학": [65, 70, 88, 55, 80],
})

means = df.mean().round(1)
print("과목별 평균:")
for subject, avg in means.items():
    print(f"  {subject}: {avg}점")

best = means.idxmax()
print(f"\\n가장 높은 평균: {best} ({means[best]}점)")`,
        expectedOutput: '과목별 평균:\n  수학: 82.0점\n  영어: 82.8점\n  과학: 71.6점\n\n가장 높은 평균: 영어 (82.8점)',
      },
      {
        title: '3단계: 두 과목의 관계 보기',
        explanation: '🔗 상관계수는 두 과목이 얼마나 같이 움직이는지를 보여줘요. 1에 가까우면 "같이 오르고", -1에 가까우면 "반대로 움직여요". 0이면 관계없어요!',
        code: `import pandas as pd

df = pd.DataFrame({
    "수학": [85, 72, 90, 68, 95],
    "영어": [78, 88, 82, 75, 91],
})

corr = df["수학"].corr(df["영어"])
print(f"수학-영어 상관계수: {corr:.3f}")

if corr > 0.5:
    print("-> 수학을 잘하면 영어도 잘하는 경향!")
elif corr < -0.5:
    print("-> 반대로 움직이는 경향!")
else:
    print("-> 뚜렷한 관계가 없어요")`,
        expectedOutput: '수학-영어 상관계수: 0.556\n-> 수학을 잘하면 영어도 잘하는 경향!',
      },
    ],
  },

  // ═══════════════════════════════════════════
  // CH4: Scikit-learn 입문
  // ═══════════════════════════════════════════

  'python-ml-practice-ch4-s1': {
    sectionId: 'python-ml-practice-ch4-s1',
    title: 'ML 파이프라인 따라하기',
    description: '머신러닝의 기본 과정을 따라해봐요. 데이터를 나누고, 모델을 학습하고, 예측하는 3단계를 배웁니다 🤖',
    packages: ['numpy', 'scikit-learn'],
    steps: [
      {
        title: '1단계: 데이터 나누기 = 시험 준비',
        explanation: '📝 시험 전에 연습문제로 공부하고, 실제 시험으로 실력을 확인하죠? ML도 똑같아요! 데이터를 "연습용(train)"과 "시험용(test)"으로 나눠요.',
        code: `import numpy as np
from sklearn.model_selection import train_test_split

X = np.array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).reshape(-1, 1)
y = np.array([2, 4, 6, 8, 10, 12, 14, 16, 18, 20])

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42
)

print("연습 데이터:", len(X_train), "개")
print("시험 데이터:", len(X_test), "개")`,
        expectedOutput: '연습 데이터: 7 개\n시험 데이터: 3 개',
      },
      {
        title: '2단계: 직선 그리기 = 선형 회귀',
        explanation: '📏 점들 사이에 가장 잘 맞는 직선을 그려주는 것이 선형 회귀예요! y = ax + b 형태의 직선을 찾아줍니다.',
        code: `import numpy as np
from sklearn.linear_model import LinearRegression

X = np.array([[1], [2], [3], [4], [5]])
y = np.array([2, 4, 6, 8, 10])

model = LinearRegression()
model.fit(X, y)

print("기울기(a):", model.coef_[0])
print("절편(b):", model.intercept_)
print("공식: y =", model.coef_[0], "* x +", model.intercept_)`,
        expectedOutput: '기울기(a): 2.0\n절편(b): 0.0\n공식: y = 2.0 * x + 0.0',
      },
      {
        title: '3단계: 예측해보기',
        explanation: '🔮 학습된 모델에 새로운 데이터를 넣으면 결과를 예측할 수 있어요! 6시간, 7시간 공부하면 점수가 얼마일까요?',
        code: `import numpy as np
from sklearn.linear_model import LinearRegression

X = np.array([[1], [2], [3], [4], [5]])
y = np.array([2, 4, 6, 8, 10])

model = LinearRegression()
model.fit(X, y)

new_X = np.array([[6], [7], [8]])
predictions = model.predict(new_X)

for x, pred in zip(new_X, predictions):
    print(f"x={x[0]} -> 예측: {pred:.1f}")`,
        expectedOutput: 'x=6 -> 예측: 12.0\nx=7 -> 예측: 14.0\nx=8 -> 예측: 16.0',
      },
    ],
  },

  'python-ml-practice-ch4-s2': {
    sectionId: 'python-ml-practice-ch4-s2',
    title: '데이터 스케일링 따라하기',
    description: '키(170cm)와 몸무게(65kg)는 숫자 범위가 다르죠? 이런 차이를 맞춰주는 스케일링을 배워봅시다 ⚖️',
    packages: ['numpy', 'scikit-learn'],
    steps: [
      {
        title: '1단계: 키와 몸무게는 숫자가 다르다',
        explanation: '⚖️ 키는 150~190 범위, 몸무게는 40~80 범위예요. 이렇게 범위가 다르면 ML 모델이 혼란스러워할 수 있어요!',
        code: `import numpy as np

data = np.array([
    [160, 50],
    [170, 65],
    [180, 80],
    [155, 45],
])

print("키 범위:", np.min(data[:,0]), "~", np.max(data[:,0]))
print("몸무게 범위:", np.min(data[:,1]), "~", np.max(data[:,1]))
print("키 평균:", np.mean(data[:,0]))
print("몸무게 평균:", np.mean(data[:,1]))`,
        expectedOutput: '키 범위: 155.0 ~ 180.0\n몸무게 범위: 45.0 ~ 80.0\n키 평균: 166.25\n몸무게 평균: 60.0',
      },
      {
        title: '2단계: 같은 기준으로 맞추기',
        explanation: '📐 StandardScaler는 모든 숫자를 "평균=0, 표준편차=1"로 맞춰줘요. 키든 몸무게든 같은 기준으로 비교할 수 있게 됩니다!',
        code: `import numpy as np
from sklearn.preprocessing import StandardScaler

data = np.array([
    [160, 50],
    [170, 65],
    [180, 80],
    [155, 45],
], dtype=float)

scaler = StandardScaler()
scaled = scaler.fit_transform(data)

print("스케일링 후:")
print(np.round(scaled, 2))`,
        expectedOutput: '스케일링 후:\n[[-0.65 -0.73]\n [ 0.39  0.37]\n [ 1.43  1.46]\n [-1.17 -1.1 ]]',
      },
      {
        title: '3단계: 스케일링 전후 비교',
        explanation: '✅ 스케일링 후에는 평균이 0, 표준편차가 1이 됩니다. 이제 모든 특성이 공평한 조건이에요!',
        code: `import numpy as np
from sklearn.preprocessing import StandardScaler

data = np.array([[160, 50], [170, 65], [180, 80], [155, 45]], dtype=float)

scaler = StandardScaler()
scaled = scaler.fit_transform(data)

print("=== 스케일링 전 ===")
print("평균:", np.round(data.mean(axis=0), 1))
print("표준편차:", np.round(data.std(axis=0), 1))

print("\\n=== 스케일링 후 ===")
print("평균:", np.round(scaled.mean(axis=0), 1))
print("표준편차:", np.round(scaled.std(axis=0), 1))`,
        expectedOutput: '=== 스케일링 전 ===\n평균: [166.25  60.  ]\n표준편차: [ 9.6 13.7]\n\n=== 스케일링 후 ===\n평균: [0. 0.]\n표준편차: [1. 1.]',
      },
    ],
  },

  'python-ml-practice-ch4-s3': {
    sectionId: 'python-ml-practice-ch4-s3',
    title: '교차 검증 따라하기',
    description: '시험을 한 번만 보면 운이 좋거나 나쁠 수 있죠? 여러 번 시험을 봐서 진짜 실력을 측정하는 교차 검증을 배워봅시다 🎯',
    packages: ['numpy', 'scikit-learn'],
    steps: [
      {
        title: '1단계: 한 번만 시험보면 운이 좌우한다',
        explanation: '🎲 한 번의 시험으로는 실력을 정확히 알 수 없어요. 운 좋게 쉬운 문제만 나올 수도 있으니까요!',
        code: `import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split

np.random.seed(42)
X = np.random.rand(30, 1) * 10
y = 2 * X.ravel() + 5 + np.random.randn(30) * 2

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

model = LinearRegression()
model.fit(X_train, y_train)
score = model.score(X_test, y_test)
print(f"1회 시험 점수(R2): {score:.3f}")`,
        expectedOutput: '1회 시험 점수(R2): 0.912',
      },
      {
        title: '2단계: 여러 번 시험보기 = 교차 검증',
        explanation: '📝 교차 검증은 데이터를 여러 조각으로 나눠서 돌아가며 시험보는 거예요! cv=3이면 3번 시험을 봅니다.',
        code: `import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import cross_val_score

np.random.seed(42)
X = np.random.rand(30, 1) * 10
y = 2 * X.ravel() + 5 + np.random.randn(30) * 2

model = LinearRegression()
scores = cross_val_score(model, X, y, cv=3, scoring="r2")

print("각 시험 점수:")
for i, s in enumerate(scores):
    print(f"  {i+1}번째: {s:.3f}")`,
        expectedOutput: '각 시험 점수:\n  1번째: 0.847\n  2번째: 0.855\n  3번째: 0.878',
      },
      {
        title: '3단계: 평균으로 실력 측정',
        explanation: '📊 여러 번 시험을 본 결과의 평균이 진짜 실력이에요! 표준편차가 작으면 안정적, 크면 들쑥날쑥한 모델입니다.',
        code: `import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import cross_val_score

np.random.seed(42)
X = np.random.rand(30, 1) * 10
y = 2 * X.ravel() + 5 + np.random.randn(30) * 2

model = LinearRegression()
scores = cross_val_score(model, X, y, cv=3, scoring="r2")

print(f"평균 점수: {scores.mean():.3f}")
print(f"표준편차: {scores.std():.3f}")
print(f"-> 이 모델의 실력은 약 {scores.mean():.1%}!")`,
        expectedOutput: '평균 점수: 0.860\n표준편차: 0.013\n-> 이 모델의 실력은 약 86.0%!',
      },
    ],
  },

  // ═══════════════════════════════════════════
  // CH5: 지도학습 실습
  // ═══════════════════════════════════════════

  'python-ml-practice-ch5-s1': {
    sectionId: 'python-ml-practice-ch5-s1',
    title: '회귀 모델 따라하기',
    description: '직선(선형 회귀)과 곡선(다항 회귀)으로 데이터의 패턴을 찾고, 얼마나 잘 맞는지 점수를 매겨봅시다 📈',
    packages: ['numpy', 'scikit-learn'],
    steps: [
      {
        title: '1단계: 데이터에서 패턴 찾기',
        explanation: '📏 가장 간단한 패턴은 직선이에요! x가 1,2,3,4,5일 때 y가 2,4,6,8,10이면 y = 2x 라는 패턴을 찾을 수 있죠.',
        code: `import numpy as np
from sklearn.linear_model import LinearRegression

X = np.array([[1], [2], [3], [4], [5]])
y = np.array([2, 4, 6, 8, 10])

model = LinearRegression()
model.fit(X, y)

print(f"기울기: {model.coef_[0]:.1f}")
print(f"절편: {model.intercept_:.1f}")
print(f"패턴: y = {model.coef_[0]:.1f} * x + {model.intercept_:.1f}")`,
        expectedOutput: '기울기: 2.0\n절편: 0.0\n패턴: y = 2.0 * x + 0.0',
      },
      {
        title: '2단계: 곡선도 그릴 수 있다',
        explanation: '🌊 데이터가 직선이 아닌 곡선 모양이라면? PolynomialFeatures로 x를 x, x2, x3 등으로 변환하면 곡선도 그릴 수 있어요!',
        code: `import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures

X = np.array([[1], [2], [3], [4], [5]])
y = np.array([1, 4, 9, 16, 25])

poly = PolynomialFeatures(degree=2)
X_poly = poly.fit_transform(X)

model = LinearRegression()
model.fit(X_poly, y)
y_pred = model.predict(X_poly)

print("실제값:", y)
print("예측값:", np.round(y_pred, 1))`,
        expectedOutput: '실제값: [ 1  4  9 16 25]\n예측값: [ 1.  4.  9. 16. 25.]',
      },
      {
        title: '3단계: 얼마나 잘 맞는지 점수 매기기',
        explanation: '📊 R2 점수는 모델이 데이터를 얼마나 잘 설명하는지 보여줘요. 1.0이면 완벽, 0이면 전혀 못 맞추는 거예요!',
        code: `import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures
from sklearn.metrics import r2_score

X = np.array([[1], [2], [3], [4], [5]])
y = np.array([1, 4, 9, 16, 25])

lr = LinearRegression()
lr.fit(X, y)
print(f"직선 R2: {r2_score(y, lr.predict(X)):.3f}")

poly = PolynomialFeatures(degree=2)
X_poly = poly.fit_transform(X)
pr = LinearRegression()
pr.fit(X_poly, y)
print(f"곡선 R2: {r2_score(y, pr.predict(X_poly)):.3f}")`,
        expectedOutput: '직선 R2: 0.982\n곡선 R2: 1.000',
      },
    ],
  },

  'python-ml-practice-ch5-s2': {
    sectionId: 'python-ml-practice-ch5-s2',
    title: '분류 모델 따라하기',
    description: 'O/X를 맞추는 것이 분류예요! 로지스틱 회귀와 SVM 두 가지 방법으로 분류하고 비교해봅시다 🎯',
    packages: ['numpy', 'scikit-learn'],
    steps: [
      {
        title: '1단계: O/X 맞추기 = 분류',
        explanation: '✅❌ 분류는 데이터를 두 그룹(O 또는 X)으로 나누는 거예요! 로지스틱 회귀는 경계선을 그어서 어느 쪽인지 판단해요.',
        code: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

X, y = make_classification(n_samples=100, n_features=2, n_redundant=0, random_state=42)

model = LogisticRegression(random_state=42)
model.fit(X, y)
y_pred = model.predict(X)

correct = np.sum(y == y_pred)
print(f"전체: {len(y)}개")
print(f"맞춘 수: {correct}개")
print(f"정확도: {accuracy_score(y, y_pred):.1%}")`,
        expectedOutput: '전체: 100개\n맞춘 수: 90개\n정확도: 90.0%',
      },
      {
        title: '2단계: SVM = 경계선 긋기',
        explanation: '✂️ SVM은 두 그룹 사이에 가장 넓은 도로를 만드는 것처럼 경계선을 그어요! 도로가 넓을수록 좋은 분류기예요.',
        code: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score

X, y = make_classification(n_samples=100, n_features=2, n_redundant=0, random_state=42)

model = SVC(kernel="rbf", random_state=42)
model.fit(X, y)
y_pred = model.predict(X)

print(f"SVM 정확도: {accuracy_score(y, y_pred):.1%}")
print(f"서포트 벡터 수: {len(model.support_vectors_)}개")`,
        expectedOutput: 'SVM 정확도: 93.0%\n서포트 벡터 수: 18개',
      },
      {
        title: '3단계: 누가 더 잘 맞추나',
        explanation: '🏆 같은 데이터에서 두 모델을 비교해볼까요? 테스트 데이터로 공정하게 비교합니다!',
        code: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score

X, y = make_classification(n_samples=100, n_features=2, n_redundant=0, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

lr = LogisticRegression(random_state=42)
lr.fit(X_train, y_train)

svm = SVC(random_state=42)
svm.fit(X_train, y_train)

print(f"로지스틱 회귀: {accuracy_score(y_test, lr.predict(X_test)):.1%}")
print(f"SVM: {accuracy_score(y_test, svm.predict(X_test)):.1%}")`,
        expectedOutput: '로지스틱 회귀: 86.7%\nSVM: 93.3%',
      },
    ],
  },

  'python-ml-practice-ch5-s3': {
    sectionId: 'python-ml-practice-ch5-s3',
    title: '앙상블 학습 따라하기',
    description: '나무 한 그루보다 숲이 강하듯, 여러 모델을 합치면 더 좋은 결과를 얻을 수 있어요! 앙상블 학습을 배워봅시다 🌳🌲🌳',
    packages: ['numpy', 'scikit-learn'],
    steps: [
      {
        title: '1단계: 나무 한 그루 = 결정 트리',
        explanation: '🌳 결정 트리는 "이 특성이 X보다 크면 왼쪽, 작으면 오른쪽"처럼 질문을 반복해서 답을 찾는 나무 구조예요!',
        code: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

X, y = make_classification(n_samples=100, n_features=4, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

tree = DecisionTreeClassifier(random_state=42)
tree.fit(X_train, y_train)

print(f"결정 트리 정확도: {accuracy_score(y_test, tree.predict(X_test)):.1%}")
print(f"트리 깊이: {tree.get_depth()}")`,
        expectedOutput: '결정 트리 정확도: 86.7%\n트리 깊이: 7',
      },
      {
        title: '2단계: 숲 만들기 = 랜덤 포레스트',
        explanation: '🌲🌳🌲 랜덤 포레스트는 나무 100그루를 심고 다수결로 결정해요! 한 나무가 틀려도 다른 나무들이 보완해줍니다.',
        code: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

X, y = make_classification(n_samples=100, n_features=4, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

forest = RandomForestClassifier(n_estimators=100, random_state=42)
forest.fit(X_train, y_train)

print(f"랜덤 포레스트 정확도: {accuracy_score(y_test, forest.predict(X_test)):.1%}")
print(f"나무 수: {forest.n_estimators}그루")`,
        expectedOutput: '랜덤 포레스트 정확도: 90.0%\n나무 수: 100그루',
      },
      {
        title: '3단계: 어떤 특성이 중요할까?',
        explanation: '🔍 랜덤 포레스트는 어떤 특성(열)이 예측에 가장 도움이 되는지 알려줘요! 중요도가 높은 특성이 핵심 단서예요.',
        code: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.ensemble import RandomForestClassifier

X, y = make_classification(n_samples=100, n_features=4, n_informative=2, random_state=42)

forest = RandomForestClassifier(n_estimators=100, random_state=42)
forest.fit(X, y)

importances = forest.feature_importances_
for i, imp in enumerate(importances):
    bar = "#" * int(imp * 30)
    print(f"특성 {i}: {imp:.3f} {bar}")`,
        expectedOutput: '특성 0: 0.103 ###\n특성 1: 0.454 #############\n특성 2: 0.064 #\n특성 3: 0.380 ###########',
      },
    ],
  },

  // ═══════════════════════════════════════════
  // CH6: 비지도학습과 모델 평가
  // ═══════════════════════════════════════════

  'python-ml-practice-ch6-s1': {
    sectionId: 'python-ml-practice-ch6-s1',
    title: '클러스터링 따라하기',
    description: '비슷한 것끼리 자동으로 그룹을 만드는 클러스터링! 정답 없이도 패턴을 찾을 수 있어요 🎨',
    packages: ['numpy', 'scikit-learn'],
    steps: [
      {
        title: '1단계: 비슷한 것끼리 모으기',
        explanation: '🎨 색칠 공부처럼, 가까이 있는 점들을 같은 색으로 칠해볼까요? K-Means는 k개의 그룹으로 자동 분류해줘요!',
        code: `import numpy as np
from sklearn.cluster import KMeans

data = np.array([
    [1, 2], [2, 1], [1, 1],
    [8, 8], [9, 9], [8, 9],
])

kmeans = KMeans(n_clusters=2, random_state=42, n_init=10)
kmeans.fit(data)

print("각 점의 그룹:", kmeans.labels_)`,
        expectedOutput: '각 점의 그룹: [0 0 0 1 1 1]',
      },
      {
        title: '2단계: 그룹 확인하기',
        explanation: '📍 각 그룹의 중심점은 그룹을 대표하는 위치예요! 중심점이 어디인지 확인해봅시다.',
        code: `import numpy as np
from sklearn.cluster import KMeans

data = np.array([
    [1, 2], [2, 1], [1, 1],
    [8, 8], [9, 9], [8, 9],
])

kmeans = KMeans(n_clusters=2, random_state=42, n_init=10)
kmeans.fit(data)

for i, center in enumerate(kmeans.cluster_centers_):
    count = np.sum(kmeans.labels_ == i)
    print(f"그룹 {i}: 중심=({center[0]:.1f}, {center[1]:.1f}), {count}개")`,
        expectedOutput: '그룹 0: 중심=(1.3, 1.3), 3개\n그룹 1: 중심=(8.3, 8.7), 3개',
      },
      {
        title: '3단계: 몇 그룹이 적당할까?',
        explanation: '🤔 그룹 수를 바꿔보면서 어떤 게 좋은지 비교해요! 관성(inertia)이 작을수록 그룹 내 점들이 가까이 모여있는 거예요.',
        code: `import numpy as np
from sklearn.cluster import KMeans

data = np.array([
    [1, 2], [2, 1], [1, 1],
    [5, 5], [6, 5],
    [8, 8], [9, 9], [8, 9],
])

for k in [2, 3, 4]:
    km = KMeans(n_clusters=k, random_state=42, n_init=10)
    km.fit(data)
    print(f"k={k}: 관성={km.inertia_:.1f}")`,
        expectedOutput: 'k=2: 관성=39.8\nk=3: 관성=5.2\nk=4: 관성=2.5',
      },
    ],
  },

  'python-ml-practice-ch6-s2': {
    sectionId: 'python-ml-practice-ch6-s2',
    title: 'PCA 차원 축소 따라하기',
    description: '데이터가 너무 복잡하면? 중요한 정보만 남기고 간단하게 만드는 PCA를 배워봅시다 🔭',
    packages: ['numpy', 'scikit-learn'],
    steps: [
      {
        title: '1단계: 차원이란?',
        explanation: '📐 키, 몸무게, 나이 이렇게 3가지 정보가 있으면 "3차원"이에요. 차원이 많으면 복잡해지니까, 중요한 것만 남기고 줄이는 게 차원 축소예요!',
        code: `import numpy as np

students = np.array([
    [160, 50, 12],
    [170, 65, 13],
    [155, 45, 12],
    [175, 70, 14],
    [165, 60, 13],
])

print("학생 수:", students.shape[0])
print("특성 수(차원):", students.shape[1])
print("특성: 키, 몸무게, 나이")`,
        expectedOutput: '학생 수: 5\n특성 수(차원): 3\n특성: 키, 몸무게, 나이',
      },
      {
        title: '2단계: 중요한 것만 남기기 = PCA',
        explanation: '🔭 PCA는 3차원 데이터를 2차원으로 줄여줘요! 마치 3D 물체를 사진(2D)으로 찍는 것처럼, 가장 많은 정보를 담는 방향으로 투영해요.',
        code: `import numpy as np
from sklearn.decomposition import PCA

data = np.array([
    [160, 50, 12],
    [170, 65, 13],
    [155, 45, 12],
    [175, 70, 14],
    [165, 60, 13],
], dtype=float)

pca = PCA(n_components=2)
reduced = pca.fit_transform(data)

print(f"원래: {data.shape[1]}차원")
print(f"축소: {reduced.shape[1]}차원")
print(f"축소된 데이터:")
print(np.round(reduced, 1))`,
        expectedOutput: '원래: 3차원\n축소: 2차원\n축소된 데이터:\n[[ -5.2   0.7]\n [ 10.1  -1.1]\n [-12.2   0.7]\n [ 15.5   1.3]\n [  -8.2  -1.6]]',
      },
      {
        title: '3단계: 얼마나 정보를 보존했나',
        explanation: '📊 차원을 줄이면 정보가 좀 사라져요. explained_variance_ratio로 원래 정보의 몇 %를 보존했는지 확인할 수 있어요!',
        code: `import numpy as np
from sklearn.decomposition import PCA

data = np.array([
    [160, 50, 12],
    [170, 65, 13],
    [155, 45, 12],
    [175, 70, 14],
    [165, 60, 13],
], dtype=float)

pca = PCA(n_components=2)
pca.fit_transform(data)

ratios = pca.explained_variance_ratio_
print(f"1번째 축: {ratios[0]:.1%} 보존")
print(f"2번째 축: {ratios[1]:.1%} 보존")
print(f"합계: {sum(ratios):.1%} 보존")`,
        expectedOutput: '1번째 축: 98.8% 보존\n2번째 축: 1.1% 보존\n합계: 99.9% 보존',
      },
    ],
  },

  'python-ml-practice-ch6-s3': {
    sectionId: 'python-ml-practice-ch6-s3',
    title: '모델 평가 따라하기',
    description: '모델이 정말 잘 하고 있을까요? 정확도, 혼동 행렬, F1 점수로 모델의 성적표를 만들어봅시다 📝',
    packages: ['numpy', 'scikit-learn'],
    steps: [
      {
        title: '1단계: 맞춘 개수 세기 = 정확도',
        explanation: '✅ 정확도는 "전체 중에서 몇 개를 맞췄는가"예요. 10문제 중 8개 맞추면 정확도 80%!',
        code: `import numpy as np

actual =    np.array([1, 0, 1, 1, 0, 1, 0, 0, 1, 1])
predicted = np.array([1, 0, 1, 0, 0, 1, 1, 0, 1, 1])

correct = np.sum(actual == predicted)
total = len(actual)
accuracy = correct / total

print(f"전체: {total}개")
print(f"맞춘 수: {correct}개")
print(f"정확도: {accuracy:.0%}")`,
        expectedOutput: '전체: 10개\n맞춘 수: 8개\n정확도: 80%',
      },
      {
        title: '2단계: 혼동 행렬 = 실수 지도',
        explanation: '🗺️ 혼동 행렬은 어디서 맞추고 어디서 틀렸는지 한눈에 보여주는 지도예요! TP(참양성), FP(거짓양성), FN(거짓음성), TN(참음성)을 보여줍니다.',
        code: `import numpy as np
from sklearn.metrics import confusion_matrix

actual =    np.array([1, 0, 1, 1, 0, 1, 0, 0, 1, 1])
predicted = np.array([1, 0, 1, 0, 0, 1, 1, 0, 1, 1])

cm = confusion_matrix(actual, predicted)
print("혼동 행렬:")
print(cm)
print(f"\\n정답=0을 0으로 맞춤: {cm[0][0]}개")
print(f"정답=0을 1로 틀림: {cm[0][1]}개")
print(f"정답=1을 0으로 틀림: {cm[1][0]}개")
print(f"정답=1을 1로 맞춤: {cm[1][1]}개")`,
        expectedOutput: '혼동 행렬:\n[[3 1]\n [1 5]]\n\n정답=0을 0으로 맞춤: 3개\n정답=0을 1로 틀림: 1개\n정답=1을 0으로 틀림: 1개\n정답=1을 1로 맞춤: 5개',
      },
      {
        title: '3단계: 종합 성적표',
        explanation: '📋 정밀도(찾은 것 중 정답 비율), 재현율(실제 정답 중 찾은 비율), F1(둘의 조화 평균)으로 종합 성적표를 만들어요!',
        code: `import numpy as np
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score

actual =    np.array([1, 0, 1, 1, 0, 1, 0, 0, 1, 1])
predicted = np.array([1, 0, 1, 0, 0, 1, 1, 0, 1, 1])

print("=== 모델 성적표 ===")
print(f"정확도: {accuracy_score(actual, predicted):.1%}")
print(f"정밀도: {precision_score(actual, predicted):.1%}")
print(f"재현율: {recall_score(actual, predicted):.1%}")
print(f"F1 점수: {f1_score(actual, predicted):.1%}")`,
        expectedOutput: '=== 모델 성적표 ===\n정확도: 80.0%\n정밀도: 83.3%\n재현율: 83.3%\nF1 점수: 83.3%',
      },
    ],
  },
}
