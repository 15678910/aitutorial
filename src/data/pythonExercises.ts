export interface PythonExercise {
  title: string
  description: string
  initialCode: string
  expectedOutput: string
  hint: string
  packages: string[]
}

export const pythonExercises: Record<string, PythonExercise> = {
  // ═══════════════════════════════════════════
  // CH1: Python 기초와 데이터 다루기
  // ═══════════════════════════════════════════

  'python-ml-practice-ch1-s1': {
    title: 'Python 기본 문법 실습',
    description: '변수, 자료형, 조건문, 반복문을 활용하여 1부터 10까지 짝수의 합을 구해보세요.',
    initialCode: `# 1부터 10까지 짝수의 합을 구하세요
# TODO: for 반복문과 if 조건문을 사용하세요

total = 0

# 여기에 코드를 작성하세요


print(total)`,
    expectedOutput: '30',
    hint: 'for i in range(1, 11): 로 반복하고, if i % 2 == 0: 으로 짝수를 판별하세요.',
    packages: [],
  },

  'python-ml-practice-ch1-s2': {
    title: '함수 정의 실습',
    description: '리스트의 평균을 구하는 함수를 만들고, map과 filter를 활용해보세요.',
    initialCode: `# 1. 리스트의 평균을 구하는 함수를 만드세요
def average(numbers):
    # TODO: 리스트의 평균을 반환하세요
    pass

# 2. 1~10 중 홀수만 필터링하세요
numbers = list(range(1, 11))
odd_numbers = list(filter(lambda x: x % 2 != 0, numbers))

# 3. 각 홀수를 제곱하세요
squared = list(map(lambda x: x ** 2, odd_numbers))

print(average([10, 20, 30, 40, 50]))
print(squared)`,
    expectedOutput: '30.0\n[1, 9, 25, 49, 81]',
    hint: 'average 함수에서 return sum(numbers) / len(numbers) 를 사용하세요.',
    packages: [],
  },

  'python-ml-practice-ch1-s3': {
    title: '데이터 구조 실습',
    description: '딕셔너리 리스트에서 특정 조건의 데이터를 추출하고 정렬해보세요.',
    initialCode: `# 학생 성적 데이터
students = [
    {"name": "김민수", "score": 85},
    {"name": "이지은", "score": 92},
    {"name": "박서준", "score": 78},
    {"name": "최영희", "score": 95},
    {"name": "정대현", "score": 88},
]

# TODO: 점수가 85 이상인 학생만 필터링하세요
top_students = []

# TODO: 점수 기준 내림차순 정렬하세요
top_students.sort(key=lambda x: x["score"], reverse=True)

# 이름만 출력
for s in top_students:
    print(s["name"], s["score"])`,
    expectedOutput: '최영희 95\n이지은 92\n정대현 88\n김민수 85',
    hint: 'top_students = [s for s in students if s["score"] >= 85] 리스트 컴프리헨션을 사용하세요.',
    packages: [],
  },

  // ═══════════════════════════════════════════
  // CH2: NumPy와 Pandas 마스터
  // ═══════════════════════════════════════════

  'python-ml-practice-ch2-s1': {
    title: 'NumPy 배열 실습',
    description: 'NumPy 배열을 생성하고 기본 연산과 인덱싱을 연습해보세요.',
    initialCode: `import numpy as np

# 1. 1부터 9까지 3x3 행렬 만들기
matrix = np.arange(1, 10).reshape(3, 3)
print("행렬:")
print(matrix)

# 2. 행렬의 각 행의 합 구하기
row_sums = np.sum(matrix, axis=1)
print("행 합:", row_sums)

# 3. TODO: 행렬에서 5보다 큰 원소만 추출하세요
big_values = []  # 수정하세요
print("5보다 큰 값:", big_values)`,
    expectedOutput: '행렬:\n[[1 2 3]\n [4 5 6]\n [7 8 9]]\n행 합: [ 6 15 24]\n5보다 큰 값: [6 7 8 9]',
    hint: 'big_values = matrix[matrix > 5] 불리언 인덱싱을 사용하세요.',
    packages: ['numpy'],
  },

  'python-ml-practice-ch2-s2': {
    title: 'Pandas DataFrame 실습',
    description: 'DataFrame을 생성하고 기본 조작을 해보세요.',
    initialCode: `import pandas as pd

# 데이터 생성
data = {
    "이름": ["김철수", "이영희", "박지민", "최수진"],
    "나이": [25, 30, 28, 35],
    "점수": [85, 92, 78, 95],
}
df = pd.DataFrame(data)

# 1. 점수 기준 내림차순 정렬
df_sorted = df.sort_values("점수", ascending=False)
print(df_sorted.to_string(index=False))

# 2. TODO: 나이가 28 이상인 행만 필터링하세요
filtered = df  # 수정하세요
print("\\n28세 이상:")
print(filtered["이름"].tolist())`,
    expectedOutput: ' 이름  나이  점수\n최수진  35  95\n이영희  30  92\n김철수  25  85\n박지민  28  78\n\n28세 이상:\n[\'이영희\', \'박지민\', \'최수진\']',
    hint: 'filtered = df[df["나이"] >= 28] 조건 필터링을 사용하세요.',
    packages: ['pandas'],
  },

  'python-ml-practice-ch2-s3': {
    title: '데이터 전처리 실습',
    description: '결측치 처리와 데이터 변환을 연습해보세요.',
    initialCode: `import pandas as pd
import numpy as np

# 결측치가 있는 데이터
data = {
    "과목": ["수학", "영어", "과학", "국어", "사회"],
    "점수": [85, np.nan, 92, np.nan, 78],
}
df = pd.DataFrame(data)

# 1. 결측치 개수 확인
print("결측치 수:", df["점수"].isna().sum())

# 2. TODO: 결측치를 평균값으로 채우세요
mean_score = df["점수"].mean()
df["점수"] = df["점수"].fillna(mean_score)

# 3. 결과 출력
print("평균:", mean_score)
print("채운 후:", df["점수"].tolist())`,
    expectedOutput: '결측치 수: 2\n평균: 85.0\n채운 후: [85.0, 85.0, 92.0, 85.0, 78.0]',
    hint: 'mean()은 NaN을 자동으로 제외하고 계산합니다. fillna()로 결측치를 채울 수 있습니다.',
    packages: ['pandas', 'numpy'],
  },

  // ═══════════════════════════════════════════
  // CH3: 데이터 시각화
  // ═══════════════════════════════════════════

  'python-ml-practice-ch3-s1': {
    title: 'Matplotlib 데이터 준비',
    description: '차트에 사용할 데이터를 생성하고 통계값을 계산해보세요.',
    initialCode: `import numpy as np

# 시뮬레이션 데이터 생성 (시드 고정)
np.random.seed(42)
scores = np.random.normal(loc=75, scale=10, size=100)
scores = np.clip(scores, 0, 100).astype(int)

# 기본 통계
print("평균:", round(np.mean(scores), 1))
print("표준편차:", round(np.std(scores), 1))
print("최소:", np.min(scores))
print("최대:", np.max(scores))

# TODO: 80점 이상인 학생 수를 구하세요
above_80 = 0  # 수정하세요
print("80점 이상:", above_80, "명")`,
    expectedOutput: '평균: 74.8\n표준편차: 9.7\n최소: 49\n최대: 97\n80점 이상: 30 명',
    hint: 'above_80 = np.sum(scores >= 80) 또는 len(scores[scores >= 80])을 사용하세요.',
    packages: ['numpy'],
  },

  'python-ml-practice-ch3-s2': {
    title: '데이터 변환과 구간 분류',
    description: '점수 데이터를 구간별로 분류하고 빈도를 계산해보세요.',
    initialCode: `import numpy as np

np.random.seed(42)
scores = np.random.normal(loc=75, scale=10, size=100).astype(int)
scores = np.clip(scores, 0, 100)

# TODO: 점수를 등급으로 변환하세요
# 90 이상: A, 80 이상: B, 70 이상: C, 60 이상: D, 나머지: F
grades = []
for s in scores:
    if s >= 90:
        grades.append("A")
    elif s >= 80:
        grades.append("B")
    elif s >= 70:
        grades.append("C")
    elif s >= 60:
        grades.append("D")
    else:
        grades.append("F")

# 등급별 인원 수 (정렬하여 출력)
from collections import Counter
counts = Counter(grades)
for grade in ["A", "B", "C", "D", "F"]:
    print(f"{grade}: {counts.get(grade, 0)}명")`,
    expectedOutput: 'A: 5명\nB: 25명\nC: 37명\nD: 23명\nF: 10명',
    hint: '각 조건을 if/elif/else로 분기하여 등급을 부여합니다.',
    packages: ['numpy'],
  },

  'python-ml-practice-ch3-s3': {
    title: 'EDA 통계 분석',
    description: 'DataFrame의 기술 통계량과 상관관계를 분석해보세요.',
    initialCode: `import numpy as np
import pandas as pd

np.random.seed(42)

# 학생 성적 데이터 생성
n = 50
data = {
    "수학": np.random.normal(75, 10, n).astype(int),
    "영어": np.random.normal(80, 8, n).astype(int),
    "과학": np.random.normal(70, 12, n).astype(int),
}
df = pd.DataFrame(data)

# 1. 각 과목 평균
print("과목별 평균:")
print(df.mean().round(1).to_string())

# 2. TODO: 수학-영어 상관계수를 구하세요
corr = 0.0  # 수정하세요
print(f"\\n수학-영어 상관계수: {round(corr, 3)}")`,
    expectedOutput: '과목별 평균:\n수학    74.9\n영어    79.8\n과학    69.8\n\n수학-영어 상관계수: 0.02',
    hint: 'corr = df["수학"].corr(df["영어"]) 를 사용하세요.',
    packages: ['numpy', 'pandas'],
  },

  // ═══════════════════════════════════════════
  // CH4: Scikit-learn 입문
  // ═══════════════════════════════════════════

  'python-ml-practice-ch4-s1': {
    title: 'ML 파이프라인 실습',
    description: '데이터를 훈련/테스트로 분할하고 간단한 모델을 학습해보세요.',
    initialCode: `import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression

# 데이터 생성 (공부시간 → 시험점수)
np.random.seed(42)
X = np.random.rand(100, 1) * 10  # 0~10시간
y = 3 * X.ravel() + 20 + np.random.randn(100) * 5  # y = 3x + 20 + noise

# TODO: 훈련/테스트 분할 (80:20, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print(f"훈련 데이터: {X_train.shape[0]}개")
print(f"테스트 데이터: {X_test.shape[0]}개")

# 모델 학습
model = LinearRegression()
model.fit(X_train, y_train)

print(f"기울기: {model.coef_[0]:.2f}")
print(f"절편: {model.intercept_:.2f}")`,
    expectedOutput: '훈련 데이터: 80개\n테스트 데이터: 20개\n기울기: 3.10\n절편: 19.64',
    hint: 'train_test_split(X, y, test_size=0.2, random_state=42)를 사용합니다.',
    packages: ['numpy', 'scikit-learn'],
  },

  'python-ml-practice-ch4-s2': {
    title: '데이터 스케일링 실습',
    description: 'StandardScaler로 데이터를 정규화하고 효과를 확인해보세요.',
    initialCode: `import numpy as np
from sklearn.preprocessing import StandardScaler

# 다른 스케일의 특성 데이터
np.random.seed(42)
data = np.array([
    [25, 50000, 3],
    [30, 60000, 5],
    [35, 80000, 8],
    [40, 70000, 6],
    [28, 55000, 4],
], dtype=float)

print("원본 데이터 평균:", np.round(data.mean(axis=0), 1))
print("원본 데이터 표준편차:", np.round(data.std(axis=0), 1))

# TODO: StandardScaler로 정규화하세요
scaler = StandardScaler()
scaled = scaler.fit_transform(data)

print("\\n정규화 후 평균:", np.round(scaled.mean(axis=0), 1))
print("정규화 후 표준편차:", np.round(scaled.std(axis=0), 1))`,
    expectedOutput: '원본 데이터 평균: [3.16e+01 6.30e+04 5.20e+00]\n원본 데이터 표준편차: [5.31e+00 1.02e+04 1.72e+00]\n\n정규화 후 평균: [0. 0. 0.]\n정규화 후 표준편차: [1. 1. 1.]',
    hint: 'scaler = StandardScaler() 후 scaler.fit_transform(data)를 호출합니다.',
    packages: ['numpy', 'scikit-learn'],
  },

  'python-ml-practice-ch4-s3': {
    title: '교차 검증 실습',
    description: 'cross_val_score로 모델 성능을 안정적으로 평가해보세요.',
    initialCode: `import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import cross_val_score

# 데이터 생성
np.random.seed(42)
X = np.random.rand(100, 1) * 10
y = 2.5 * X.ravel() + 15 + np.random.randn(100) * 3

# TODO: 5-fold 교차 검증으로 R² 점수를 구하세요
model = LinearRegression()
scores = cross_val_score(model, X, y, cv=5, scoring="r2")

print(f"각 폴드 R² 점수: {np.round(scores, 3)}")
print(f"평균 R²: {scores.mean():.3f}")
print(f"표준편차: {scores.std():.3f}")`,
    expectedOutput: '각 폴드 R² 점수: [0.862 0.893 0.879 0.869 0.814]\n평균 R²: 0.863\n표준편차: 0.027',
    hint: 'cross_val_score(model, X, y, cv=5, scoring="r2")로 5-fold CV를 수행합니다.',
    packages: ['numpy', 'scikit-learn'],
  },

  // ═══════════════════════════════════════════
  // CH5: 지도학습 실습
  // ═══════════════════════════════════════════

  'python-ml-practice-ch5-s1': {
    title: '회귀 모델 실습',
    description: '선형 회귀와 다항 회귀를 비교하고 R² 점수를 확인해보세요.',
    initialCode: `import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures
from sklearn.metrics import r2_score

# 비선형 데이터 생성
np.random.seed(42)
X = np.sort(np.random.rand(50, 1) * 6, axis=0)
y = np.sin(X).ravel() + np.random.randn(50) * 0.1

# 1. 단순 선형 회귀
lr = LinearRegression()
lr.fit(X, y)
y_pred_lr = lr.predict(X)
print(f"선형 회귀 R²: {r2_score(y, y_pred_lr):.3f}")

# 2. TODO: 3차 다항 회귀를 적용하세요
poly = PolynomialFeatures(degree=3)
X_poly = poly.fit_transform(X)
pr = LinearRegression()
pr.fit(X_poly, y)
y_pred_pr = pr.predict(X_poly)
print(f"다항 회귀 R²: {r2_score(y, y_pred_pr):.3f}")`,
    expectedOutput: '선형 회귀 R²: 0.048\n다항 회귀 R²: 0.919',
    hint: 'PolynomialFeatures(degree=3)으로 특성을 변환한 후 LinearRegression을 적용합니다.',
    packages: ['numpy', 'scikit-learn'],
  },

  'python-ml-practice-ch5-s2': {
    title: '분류 모델 실습',
    description: '로지스틱 회귀와 SVM으로 분류하고 정확도를 비교해보세요.',
    initialCode: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score

# 분류 데이터 생성
X, y = make_classification(n_samples=200, n_features=4, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# 1. 로지스틱 회귀
lr = LogisticRegression(random_state=42)
lr.fit(X_train, y_train)
print(f"로지스틱 회귀: {accuracy_score(y_test, lr.predict(X_test)):.3f}")

# 2. TODO: SVM (kernel='rbf') 모델을 학습하고 정확도를 출력하세요
svm = SVC(kernel="rbf", random_state=42)
svm.fit(X_train, y_train)
print(f"SVM: {accuracy_score(y_test, svm.predict(X_test)):.3f}")`,
    expectedOutput: '로지스틱 회귀: 0.917\nSVM: 0.917',
    hint: 'SVC(kernel="rbf", random_state=42)로 SVM 모델을 생성하고 fit, predict를 호출합니다.',
    packages: ['numpy', 'scikit-learn'],
  },

  'python-ml-practice-ch5-s3': {
    title: '앙상블 학습 실습',
    description: 'RandomForest와 GradientBoosting을 비교해보세요.',
    initialCode: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import accuracy_score

# 데이터 생성
X, y = make_classification(n_samples=300, n_features=6, n_informative=4, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# 1. Random Forest
rf = RandomForestClassifier(n_estimators=100, random_state=42)
rf.fit(X_train, y_train)
print(f"Random Forest: {accuracy_score(y_test, rf.predict(X_test)):.3f}")

# 2. Gradient Boosting
gb = GradientBoostingClassifier(n_estimators=100, random_state=42)
gb.fit(X_train, y_train)
print(f"Gradient Boosting: {accuracy_score(y_test, gb.predict(X_test)):.3f}")

# 3. 특성 중요도 (Random Forest)
importances = rf.feature_importances_
print(f"\\n특성 중요도: {np.round(importances, 3)}")`,
    expectedOutput: 'Random Forest: 0.933\nGradient Boosting: 0.956\n\n특성 중요도: [0.134 0.299 0.069 0.312 0.092 0.093]',
    hint: 'RandomForestClassifier와 GradientBoostingClassifier 모두 n_estimators=100, random_state=42를 사용합니다.',
    packages: ['numpy', 'scikit-learn'],
  },

  // ═══════════════════════════════════════════
  // CH6: 비지도학습과 모델 평가
  // ═══════════════════════════════════════════

  'python-ml-practice-ch6-s1': {
    title: '클러스터링 실습',
    description: 'K-Means로 데이터를 그룹화하고 결과를 확인해보세요.',
    initialCode: `import numpy as np
from sklearn.cluster import KMeans
from sklearn.datasets import make_blobs

# 3개 그룹의 데이터 생성
X, y_true = make_blobs(n_samples=150, centers=3, cluster_std=1.0, random_state=42)

# TODO: K-Means (k=3) 클러스터링 수행
kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
kmeans.fit(X)

# 결과 확인
labels = kmeans.labels_
print(f"클러스터별 개수: {np.bincount(labels)}")
print(f"관성(Inertia): {kmeans.inertia_:.1f}")

# 중심점
centers = kmeans.cluster_centers_
for i, c in enumerate(centers):
    print(f"클러스터 {i} 중심: ({c[0]:.1f}, {c[1]:.1f})")`,
    expectedOutput: '클러스터별 개수: [50 50 50]\n관성(Inertia): 152.0\n클러스터 0 중심: (-7.5, -1.6)\n클러스터 1 중심: (1.6, 4.1)\n클러스터 2 중심: (-1.5, 2.8)',
    hint: 'KMeans(n_clusters=3, random_state=42, n_init=10)으로 객체를 생성하고 fit(X)를 호출합니다.',
    packages: ['numpy', 'scikit-learn'],
  },

  'python-ml-practice-ch6-s2': {
    title: 'PCA 차원 축소 실습',
    description: '4차원 데이터를 2차원으로 축소하고 분산 비율을 확인해보세요.',
    initialCode: `import numpy as np
from sklearn.decomposition import PCA
from sklearn.datasets import load_iris

# Iris 데이터 로드 (4차원)
iris = load_iris()
X = iris.data
print(f"원본 차원: {X.shape}")

# TODO: PCA로 2차원으로 축소하세요
pca = PCA(n_components=2)
X_reduced = pca.fit_transform(X)
print(f"축소 차원: {X_reduced.shape}")

# 분산 설명 비율
print(f"\\n각 주성분 분산 비율: {np.round(pca.explained_variance_ratio_, 3)}")
print(f"총 분산 설명: {pca.explained_variance_ratio_.sum():.3f}")`,
    expectedOutput: '원본 차원: (150, 4)\n축소 차원: (150, 2)\n\n각 주성분 분산 비율: [0.925 0.053]\n총 분산 설명: 0.978',
    hint: 'PCA(n_components=2)로 객체를 생성하고 fit_transform(X)을 호출합니다.',
    packages: ['numpy', 'scikit-learn'],
  },

  'python-ml-practice-ch6-s3': {
    title: '모델 평가 실습',
    description: '혼동 행렬과 정밀도/재현율을 계산하여 모델을 종합 평가해보세요.',
    initialCode: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix

# 데이터 생성
X, y = make_classification(n_samples=200, n_features=5, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# 모델 학습
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)
y_pred = model.predict(X_test)

# 평가 지표 출력
print(f"정확도: {accuracy_score(y_test, y_pred):.3f}")
print(f"정밀도: {precision_score(y_test, y_pred):.3f}")
print(f"재현율: {recall_score(y_test, y_pred):.3f}")
print(f"F1 점수: {f1_score(y_test, y_pred):.3f}")

# 혼동 행렬
cm = confusion_matrix(y_test, y_pred)
print(f"\\n혼동 행렬:\\n{cm}")`,
    expectedOutput: '정확도: 0.917\n정밀도: 0.935\n재현율: 0.906\nF1 점수: 0.921\n\n혼동 행렬:\n[[26  2]\n [ 3 29]]',
    hint: 'sklearn.metrics에서 accuracy_score, precision_score, recall_score, f1_score, confusion_matrix를 임포트하여 사용합니다.',
    packages: ['numpy', 'scikit-learn'],
  },

  // ═══════════════════════════════════════════
  // AI 입문 코스 - 초등학생용 Python 실습
  // ═══════════════════════════════════════════

  'ai-intro-ch1-s1': {
    title: '🎉 첫 번째 코드 실행하기!',
    description: 'print()는 화면에 글자를 보여주는 마법 주문이에요. 큰따옴표 안에 원하는 말을 넣어보세요!',
    initialCode: `# 화면에 인사말을 출력해보세요!
# print() 안에 원하는 말을 넣으면 화면에 나타나요

print("안녕, 나는 AI야!")

# 아래에 여러분의 인사말도 추가해보세요!
`,
    expectedOutput: '안녕, 나는 AI야!',
    hint: 'print("여기에 하고 싶은 말을 넣으세요") 이렇게 쓰면 돼요! 큰따옴표("")를 꼭 넣어야 해요.',
    packages: [],
  },

  'ai-intro-ch1-s2': {
    title: '🔢 컴퓨터로 계산하기',
    description: 'Python은 아주 똑똑한 계산기예요! 더하기(+), 빼기(-), 곱하기(*), 나누기(/)를 해볼까요?',
    initialCode: `# 컴퓨터로 계산해보세요!
print(3 + 5)
print(10 - 4)
print(6 * 7)

# 아래에 여러분만의 계산을 추가해보세요!
`,
    expectedOutput: '8\n6\n42',
    hint: '더하기는 +, 빼기는 -, 곱하기는 *, 나누기는 / 기호를 사용해요.',
    packages: [],
  },

  'ai-intro-ch2-s1': {
    title: '📦 변수에 저장하기',
    description: '변수는 값을 담아두는 상자예요. 이름을 붙여서 나중에 다시 꺼내 쓸 수 있어요!',
    initialCode: `# 변수에 값을 저장해보세요!
이름 = "민수"
나이 = 11
학교 = "행복초등학교"

print(이름 + "는 " + str(나이) + "살이에요")
print(학교 + " 학생이에요")

# 여러분의 정보로 바꿔보세요!
`,
    expectedOutput: '민수는 11살이에요\n행복초등학교 학생이에요',
    hint: '이름 = "내이름" 이렇게 큰따옴표 안에 글자를 넣으면 돼요. 숫자는 따옴표 없이 써요!',
    packages: [],
  },

  'ai-intro-ch2-s2': {
    title: '📋 리스트 만들기',
    description: '리스트는 여러 개의 물건을 한 줄로 정리하는 서랍이에요. 대괄호 []로 만들어요!',
    initialCode: `# 좋아하는 과일 리스트를 만들어보세요!
과일 = ["사과", "바나나", "딸기"]

print("내가 좋아하는 과일:")
for 하나 in 과일:
    print("- " + 하나)

print("총 " + str(len(과일)) + "가지!")

# 과일을 더 추가해보세요! (쉼표로 구분)
`,
    expectedOutput: '내가 좋아하는 과일:\n- 사과\n- 바나나\n- 딸기\n총 3가지!',
    hint: '리스트에 추가하려면 과일 = ["사과", "바나나", "딸기", "포도"] 이렇게 쉼표 뒤에 넣으면 돼요!',
    packages: [],
  },

  'ai-intro-ch3-s1': {
    title: '🔄 반복문으로 인사하기',
    description: 'for 반복문은 같은 일을 여러 번 해주는 마법이에요. "5번 인사해!" 같은 명령을 내릴 수 있어요.',
    initialCode: `# 5번 반복해서 인사해보세요!
for i in range(5):
    print(str(i + 1) + "번째: 안녕하세요!")

print("인사 끝!")

# range(5)의 숫자를 바꿔서 횟수를 조절해보세요!
`,
    expectedOutput: '1번째: 안녕하세요!\n2번째: 안녕하세요!\n3번째: 안녕하세요!\n4번째: 안녕하세요!\n5번째: 안녕하세요!\n인사 끝!',
    hint: 'range(5)는 0부터 4까지 5번 반복해요. range(10)으로 바꾸면 10번 반복해요!',
    packages: [],
  },

  'ai-intro-ch3-s2': {
    title: '🤖 AI처럼 판단하기',
    description: 'AI는 조건을 보고 판단해요. if/else를 사용하면 컴퓨터도 판단할 수 있어요!',
    initialCode: `# AI처럼 동물을 분류해보세요!
def 동물_분류(다리수, 날개있음):
    if 날개있음:
        return "새"
    elif 다리수 == 4:
        return "포유류"
    elif 다리수 == 0:
        return "뱀 또는 물고기"
    else:
        return "기타 동물"

# 동물들을 분류해봅시다!
print("참새:", 동물_분류(2, True))
print("강아지:", 동물_분류(4, False))
print("뱀:", 동물_분류(0, False))
print("고양이:", 동물_분류(4, False))
`,
    expectedOutput: '참새: 새\n강아지: 포유류\n뱀: 뱀 또는 물고기\n고양이: 포유류',
    hint: 'if는 "만약 ~라면"이에요. elif는 "그게 아니고 ~라면", else는 "그 외에는"이에요. AI도 이런 규칙으로 판단해요!',
    packages: [],
  },

  'ai-intro-ch4-s1': {
    title: '🧠 나만의 신경망 만들기',
    description: '신경망은 뇌의 뉴런처럼 입력을 받아서 계산하고 결과를 내보내요. 간단한 뉴런을 만들어봅시다!',
    initialCode: `# 간단한 뉴런(신경세포)을 만들어보세요!
def 뉴런(입력1, 입력2, 가중치1, 가중치2):
    합계 = 입력1 * 가중치1 + 입력2 * 가중치2
    # 활성화: 합계가 1보다 크면 "발화!", 아니면 "조용"
    if 합계 > 1:
        return "발화!"
    else:
        return "조용"

# 뉴런에 신호를 보내봅시다!
print("입력(1,1):", 뉴런(1, 1, 0.5, 0.5))
print("입력(1,1):", 뉴런(1, 1, 0.7, 0.8))
print("입력(0,1):", 뉴런(0, 1, 0.7, 0.8))

# 가중치를 바꿔서 결과가 어떻게 달라지는지 실험해보세요!
`,
    expectedOutput: '입력(1,1): 조용\n입력(1,1): 발화!\n입력(0,1): 조용',
    hint: '가중치는 신호의 중요도예요. 가중치가 크면 그 입력이 더 중요해져요. 합계가 1을 넘으면 뉴런이 "발화"해요!',
    packages: [],
  },

  'ai-intro-ch4-s2': {
    title: '📊 딥러닝 점수 매기기',
    description: '딥러닝은 여러 층의 뉴런이 협력해서 판단해요. 간단한 점수 계산을 해봅시다!',
    initialCode: `# 딥러닝처럼 여러 단계로 점수를 계산해봅시다!

# 1층: 입력 데이터
수학점수 = 85
영어점수 = 90
체육점수 = 75

# 2층: 가중 평균 (과목별 중요도가 달라요)
학업점수 = 수학점수 * 0.4 + 영어점수 * 0.4
체력점수 = 체육점수 * 0.2

# 3층: 최종 판단
종합점수 = 학업점수 + 체력점수
print("종합 점수:", 종합점수)

if 종합점수 >= 80:
    print("결과: 우수!")
else:
    print("결과: 노력하세요!")
`,
    expectedOutput: '종합 점수: 85.0\n결과: 우수!',
    hint: '각 층에서 계산한 결과가 다음 층으로 전달돼요. 이것이 딥러닝의 기본 원리예요!',
    packages: [],
  },

  'ai-intro-ch5-s1': {
    title: '🏥 AI 활용 분야 체험하기',
    description: 'AI는 병원, 학교, 게임 등 다양한 곳에서 사용돼요. 간단한 AI 진단 프로그램을 만들어봐요!',
    initialCode: `# AI 건강 체크 프로그램을 만들어보세요!
def 건강체크(체온, 기침, 콧물):
    증상 = []
    if 체온 >= 37.5:
        증상.append("발열")
    if 기침:
        증상.append("기침")
    if 콧물:
        증상.append("콧물")

    if len(증상) == 0:
        return "건강해요! 😊"
    elif len(증상) >= 2:
        return "병원에 가보세요! 증상: " + ", ".join(증상)
    else:
        return "조금 쉬세요. 증상: " + ", ".join(증상)

# 여러 사람을 체크해봅시다!
print("민수:", 건강체크(36.5, False, False))
print("지은:", 건강체크(38.2, True, True))
print("하나:", 건강체크(37.0, True, False))
`,
    expectedOutput: '민수: 건강해요! 😊\n지은: 병원에 가보세요! 증상: 발열, 기침, 콧물\n하나: 조금 쉬세요. 증상: 기침',
    hint: 'AI 진단도 이런 규칙을 수만 개 모아서 만들어요! 증상이 많을수록 더 심각하다고 판단하는 거예요.',
    packages: [],
  },

  'ai-intro-ch5-s2': {
    title: '⚖️ AI의 공정한 판단',
    description: 'AI가 편향되면 불공정한 결과가 나올 수 있어요. 공정한 AI를 만드는 방법을 체험해봐요!',
    initialCode: `# 편향된 AI vs 공정한 AI를 비교해봅시다!

학생들 = [
    {"이름": "민수", "점수": 85, "성별": "남"},
    {"이름": "지은", "점수": 90, "성별": "여"},
    {"이름": "하나", "점수": 88, "성별": "여"},
    {"이름": "준호", "점수": 82, "성별": "남"},
]

# 공정한 AI: 점수만으로 판단!
print("=== 공정한 AI (점수 기준) ===")
for 학생 in sorted(학생들, key=lambda x: x["점수"], reverse=True):
    print(f'{학생["이름"]}: {학생["점수"]}점')
`,
    expectedOutput: '=== 공정한 AI (점수 기준) ===\n지은: 90점\n하나: 88점\n민수: 85점\n준호: 82점',
    hint: '공정한 AI는 성별, 나이, 출신지 같은 것이 아니라 실력(점수)만으로 판단해야 해요!',
    packages: [],
  },

  'ai-intro-ch6-s1': {
    title: '🚧 AI의 한계 알아보기',
    description: 'AI도 못하는 것이 있어요! AI가 어떤 상황에서 실수하는지 직접 확인해봐요.',
    initialCode: `# AI가 어려워하는 상황을 체험해봅시다!

def 간단한_AI(질문):
    # AI는 학습한 패턴만 알아요
    알고있는것 = {
        "1+1": "2",
        "하늘색": "파란색",
        "한국수도": "서울",
    }

    if 질문 in 알고있는것:
        return "답: " + 알고있는것[질문]
    else:
        return "모르겠어요... (학습하지 않은 질문)"

print(간단한_AI("1+1"))
print(간단한_AI("하늘색"))
print(간단한_AI("사랑이란"))
print(간단한_AI("행복의 의미"))

# AI는 학습하지 않은 것은 대답할 수 없어요!
`,
    expectedOutput: '답: 2\n답: 파란색\n모르겠어요... (학습하지 않은 질문)\n모르겠어요... (학습하지 않은 질문)',
    hint: 'AI는 사전에 학습한 데이터에서만 답을 찾아요. 감정이나 철학 같은 질문은 아직 어려워해요!',
    packages: [],
  },

  'ai-intro-ch6-s2': {
    title: '🚀 미래의 AI 상상하기',
    description: '미래의 AI는 어떤 모습일까요? 여러분이 상상하는 AI를 코드로 만들어봐요!',
    initialCode: `# 미래의 AI 비서를 만들어보세요!
class 미래AI비서:
    def __init__(self, 이름):
        self.이름 = 이름
        self.기능 = []

    def 기능추가(self, 기능):
        self.기능.append(기능)
        print(f"✨ [{기능}] 기능이 추가되었어요!")

    def 소개(self):
        print(f"안녕! 나는 {self.이름}이야!")
        print(f"나는 {len(self.기능)}가지를 할 수 있어:")
        for i, 기능 in enumerate(self.기능, 1):
            print(f"  {i}. {기능}")

# 나만의 AI 비서를 만들어보세요!
내AI = 미래AI비서("똑똑이")
내AI.기능추가("숙제 도와주기")
내AI.기능추가("그림 그려주기")
내AI.기능추가("노래 만들어주기")
print()
내AI.소개()

# 기능을 더 추가해보세요!
`,
    expectedOutput: '✨ [숙제 도와주기] 기능이 추가되었어요!\n✨ [그림 그려주기] 기능이 추가되었어요!\n✨ [노래 만들어주기] 기능이 추가되었어요!\n\n안녕! 나는 똑똑이야!\n나는 3가지를 할 수 있어:\n  1. 숙제 도와주기\n  2. 그림 그려주기\n  3. 노래 만들어주기',
    hint: '기능추가()로 원하는 기능을 마음껏 추가해보세요! 미래의 AI는 여러분이 상상하는 것보다 더 많은 일을 할 수 있을 거예요.',
    packages: [],
  },

  // ═══════════════════════════════════════════
  // 머신러닝 기초 (ml-basics)
  // ═══════════════════════════════════════════

  'ml-basics-ch1-s1': {
    title: '🤖 머신러닝이 뭐예요?',
    description: '머신러닝은 컴퓨터가 데이터를 보고 스스로 규칙을 찾아내는 거예요! 사과와 바나나를 구분하는 간단한 머신러닝을 만들어봐요.',
    initialCode: `# 과일을 구분하는 간단한 머신러닝!
# 데이터: [무게(g), 둥근정도(0~10)]
과일데이터 = [
    [150, 9, "사과"],
    [120, 3, "바나나"],
    [180, 8, "사과"],
    [110, 2, "바나나"],
]

# 머신러닝처럼 규칙을 찾아보자!
def 과일예측(무게, 둥근정도):
    if 둥근정도 >= 5:
        return "사과"
    else:
        return "바나나"

# 테스트!
print("무게 160, 둥근 7:", 과일예측(160, 7))
print("무게 100, 둥근 2:", 과일예측(100, 2))
print("무게 140, 둥근 8:", 과일예측(140, 8))

# 맞춘 개수 세기
맞춤 = 0
for 데이터 in 과일데이터:
    예측 = 과일예측(데이터[0], 데이터[1])
    if 예측 == 데이터[2]:
        맞춤 += 1
print(f"정확도: {맞춤}/{len(과일데이터)}")`,
    expectedOutput: '무게 160, 둥근 7: 사과\n무게 100, 둥근 2: 바나나\n무게 140, 둥근 8: 사과\n정확도: 4/4',
    hint: '둥근정도가 5 이상이면 사과, 아니면 바나나로 분류해요. 머신러닝도 이렇게 데이터에서 규칙을 찾아요!',
    packages: [],
  },

  'ml-basics-ch2-s1': {
    title: '📈 선형회귀 체험하기',
    description: '선형회귀는 점들 사이에 가장 잘 맞는 직선을 찾는 거예요! 공부시간과 시험점수의 관계를 찾아봐요.',
    initialCode: `import numpy as np
from sklearn.linear_model import LinearRegression

# 공부시간(시간)과 시험점수
공부시간 = np.array([1, 2, 3, 4, 5]).reshape(-1, 1)
시험점수 = np.array([30, 45, 55, 70, 85])

# 선형회귀 모델 학습
모델 = LinearRegression()
모델.fit(공부시간, 시험점수)

# 결과 확인
기울기 = round(모델.coef_[0], 1)
시작점 = round(모델.intercept_, 1)
print(f"규칙: 점수 = {기울기} x 공부시간 + {시작점}")

# 6시간 공부하면 몇 점?
예측 = 모델.predict(np.array([[6]]))[0]
print(f"6시간 공부하면: {round(예측, 1)}점")`,
    expectedOutput: '규칙: 점수 = 13.0 x 공부시간 + 17.0\n6시간 공부하면: 95.0점',
    hint: 'LinearRegression은 점들 사이에 직선을 그어줘요. 기울기가 13이면 1시간 더 공부할 때마다 13점씩 오른다는 뜻이에요!',
    packages: ['numpy', 'scikit-learn'],
  },

  // ═══════════════════════════════════════════
  // 딥러닝 (deep-learning)
  // ═══════════════════════════════════════════

  'deep-learning-ch1-s1': {
    title: '🧠 퍼셉트론 만들기',
    description: '퍼셉트론은 뇌의 뉴런을 본뜬 가장 간단한 인공 신경이에요! AND 게이트를 만들어봐요.',
    initialCode: `# 퍼셉트론으로 AND 게이트 만들기!
# AND: 둘 다 1이면 1, 아니면 0

def 퍼셉트론(입력1, 입력2, 가중치1, 가중치2, 기준값):
    합계 = 입력1 * 가중치1 + 입력2 * 가중치2
    if 합계 > 기준값:
        return 1
    else:
        return 0

# AND 게이트 테스트 (가중치 0.5, 기준값 0.7)
print("AND 게이트:")
print(f"0 AND 0 = {퍼셉트론(0, 0, 0.5, 0.5, 0.7)}")
print(f"0 AND 1 = {퍼셉트론(0, 1, 0.5, 0.5, 0.7)}")
print(f"1 AND 0 = {퍼셉트론(1, 0, 0.5, 0.5, 0.7)}")
print(f"1 AND 1 = {퍼셉트론(1, 1, 0.5, 0.5, 0.7)}")

# OR 게이트 (기준값을 낮추면!)
print("\\nOR 게이트:")
print(f"0 OR 0 = {퍼셉트론(0, 0, 0.5, 0.5, 0.3)}")
print(f"0 OR 1 = {퍼셉트론(0, 1, 0.5, 0.5, 0.3)}")
print(f"1 OR 0 = {퍼셉트론(1, 0, 0.5, 0.5, 0.3)}")
print(f"1 OR 1 = {퍼셉트론(1, 1, 0.5, 0.5, 0.3)}")`,
    expectedOutput: 'AND 게이트:\n0 AND 0 = 0\n0 AND 1 = 0\n1 AND 0 = 0\n1 AND 1 = 1\n\nOR 게이트:\n0 OR 0 = 0\n0 OR 1 = 1\n1 OR 0 = 1\n1 OR 1 = 1',
    hint: '가중치와 기준값을 바꾸면 다른 결과가 나와요! AND는 기준값이 높고, OR는 기준값이 낮아요.',
    packages: [],
  },

  'deep-learning-ch2-s1': {
    title: '🔍 CNN처럼 패턴 찾기',
    description: 'CNN은 이미지에서 패턴을 찾는 딥러닝이에요! 숫자 격자에서 특정 패턴을 찾아보는 체험을 해봐요.',
    initialCode: `# CNN처럼 격자에서 패턴 찾기!
# 5x5 이미지(숫자로 표현)
이미지 = [
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
    [1, 1, 1, 1, 1],
    [0, 1, 1, 1, 0],
    [0, 0, 1, 0, 0],
]

# 3x3 필터(세로줄 감지기)
필터 = [
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
]

# 필터를 이미지 위에 올려서 겹치는 부분 계산!
결과 = []
for i in range(3):
    행 = []
    for j in range(3):
        합계 = 0
        for fi in range(3):
            for fj in range(3):
                합계 += 이미지[i+fi][j+fj] * 필터[fi][fj]
        행.append(합계)
    결과.append(행)

print("원본 이미지 (가운데 줄):", 이미지[2])
print("필터 적용 결과:")
for 행 in 결과:
    print(행)`,
    expectedOutput: '원본 이미지 (가운데 줄): [1, 1, 1, 1, 1]\n필터 적용 결과:\n[1, 3, 1]\n[2, 3, 2]\n[1, 3, 1]',
    hint: 'CNN의 필터는 이미지 위를 슬라이딩하면서 패턴을 찾아요. 숫자가 클수록 그 위치에 세로줄 패턴이 있다는 뜻이에요!',
    packages: [],
  },

  // ═══════════════════════════════════════════
  // 생성형 AI (generative-ai)
  // ═══════════════════════════════════════════

  'generative-ai-ch1-s1': {
    title: '✨ 생성형 AI 체험하기',
    description: '생성형 AI는 새로운 것을 만들어내는 AI예요! 간단한 문장 생성기를 만들어서 AI가 어떻게 글을 쓰는지 체험해봐요.',
    initialCode: `# 간단한 문장 생성기 만들기!
import random
random.seed(42)

# 단어 사전
주어 = ["고양이가", "강아지가", "토끼가", "펭귄이"]
동사 = ["뛰어다녔어요", "노래했어요", "춤을 췄어요", "잠을 잤어요"]
장소 = ["공원에서", "학교에서", "집에서", "바다에서"]

# AI처럼 무작위로 문장 만들기!
print("🤖 AI가 만든 이야기:")
for i in range(4):
    문장 = f"{random.choice(장소)} {random.choice(주어)} {random.choice(동사)}"
    print(f"  {i+1}. {문장}")

print(f"\\n단어 조합 가능 수: {len(주어) * len(동사) * len(장소)}가지")`,
    expectedOutput: '🤖 AI가 만든 이야기:\n  1. 바다에서 펭귄이 노래했어요\n  2. 공원에서 토끼가 뛰어다녔어요\n  3. 학교에서 강아지가 잠을 잤어요\n  4. 공원에서 고양이가 춤을 췄어요\n\n단어 조합 가능 수: 64가지',
    hint: 'random.choice()는 리스트에서 하나를 무작위로 골라요. 생성형 AI도 이와 비슷하게 확률적으로 다음 단어를 골라요!',
    packages: [],
  },

  'generative-ai-ch2-s1': {
    title: '🔤 트랜스포머 원리 체험',
    description: '트랜스포머는 문장에서 어떤 단어가 중요한지 "주의(Attention)"를 기울여요! 단어 중요도를 계산해봐요.',
    initialCode: `# 트랜스포머의 어텐션(주의) 체험!
# 각 단어가 다른 단어에 얼마나 관심을 가지는지 점수 매기기

문장 = ["나는", "학교에서", "수학을", "공부했다"]

# 간단한 관련도 점수 (0~10)
관련도 = {
    ("나는", "공부했다"): 9,
    ("학교에서", "공부했다"): 8,
    ("수학을", "공부했다"): 10,
    ("나는", "수학을"): 5,
}

print("📊 어텐션(주의) 점수:")
for (단어1, 단어2), 점수 in 관련도.items():
    막대 = "█" * 점수
    print(f"  {단어1} → {단어2}: {막대} ({점수})")

# 가장 관련 높은 쌍 찾기
최고쌍 = max(관련도, key=관련도.get)
print(f"\\n가장 관련 높은 쌍: {최고쌍[0]} ↔ {최고쌍[1]}")`,
    expectedOutput: '📊 어텐션(주의) 점수:\n  나는 → 공부했다: █████████ (9)\n  학교에서 → 공부했다: ████████ (8)\n  수학을 → 공부했다: ██████████ (10)\n  나는 → 수학을: █████ (5)\n\n가장 관련 높은 쌍: 수학을 ↔ 공부했다',
    hint: '트랜스포머는 문장의 모든 단어 쌍을 비교해서 관련도를 계산해요. "수학을"과 "공부했다"가 가장 관련이 높죠!',
    packages: [],
  },

  // ═══════════════════════════════════════════
  // AI 만들기 (making-ai)
  // ═══════════════════════════════════════════

  'making-ai-ch1-s2': {
    title: '📉 최적화란? 가장 좋은 답 찾기',
    description: '최적화는 여러 방법 중에서 가장 좋은 답을 찾는 거예요! 가격을 조절해서 이익을 최대로 만들어봐요.',
    initialCode: `# 레모네이드 가게 최적화!
# 가격에 따라 손님 수와 이익이 달라져요

def 이익계산(가격):
    원가 = 300  # 레모네이드 만드는 비용
    손님수 = max(0, 50 - 가격 // 100)  # 비쌀수록 손님 적음
    이익 = (가격 - 원가) * 손님수
    return 이익, 손님수

# 여러 가격으로 실험!
print("💰 레모네이드 가격 실험:")
최고이익 = 0
최고가격 = 0
for 가격 in range(500, 3001, 500):
    이익, 손님 = 이익계산(가격)
    print(f"  {가격}원: 손님 {손님}명, 이익 {이익}원")
    if 이익 > 최고이익:
        최고이익 = 이익
        최고가격 = 가격

print(f"\\n최적 가격: {최고가격}원 (이익: {최고이익}원)")`,
    expectedOutput: '💰 레모네이드 가격 실험:\n  500원: 손님 45명, 이익 9000원\n  1000원: 손님 40명, 이익 28000원\n  1500원: 손님 35명, 이익 42000원\n  2000원: 손님 30명, 이익 51000원\n  2500원: 손님 25명, 이익 55000원\n  3000원: 손님 20명, 이익 54000원\n\n최적 가격: 2500원 (이익: 55000원)',
    hint: '가격이 너무 싸면 이익이 적고, 너무 비싸면 손님이 안 와요. 최적화는 이 균형을 찾는 거예요!',
    packages: [],
  },

  'making-ai-ch2-s2': {
    title: '🎲 베이즈 정리 체험하기',
    description: '베이즈 정리는 새로운 정보가 생기면 생각을 업데이트하는 방법이에요! 날씨 예측으로 체험해봐요.',
    initialCode: `# 베이즈 정리로 날씨 예측하기!
# 구름이 끼면 비가 올 확률은?

# 기본 확률
비올확률 = 0.3       # 평소에 비 올 확률 30%
구름_비 = 0.9         # 비 오는 날 구름 낄 확률 90%
구름_맑음 = 0.2       # 맑은 날 구름 낄 확률 20%

# 베이즈 계산!
구름확률 = 구름_비 * 비올확률 + 구름_맑음 * (1 - 비올확률)
비_구름 = (구름_비 * 비올확률) / 구름확률

print("☁️ 베이즈 날씨 예측:")
print(f"  평소 비 올 확률: {비올확률*100:.0f}%")
print(f"  구름 끼었을 때 비 올 확률: {비_구름*100:.1f}%")

# 우산 가져갈지 결정!
if 비_구름 > 0.5:
    print("  → 우산 가져가세요! ☂️")
else:
    print("  → 우산 안 가져가도 돼요! ☀️")`,
    expectedOutput: '☁️ 베이즈 날씨 예측:\n  평소 비 올 확률: 30%\n  구름 끼었을 때 비 올 확률: 65.9%\n  → 우산 가져가세요! ☂️',
    hint: '구름이라는 새 정보가 생기면 비 올 확률이 30%에서 65.9%로 올라가요! 이것이 베이즈 정리의 힘이에요.',
    packages: [],
  },

  // ═══════════════════════════════════════════
  // Claude Code 입문 (claude-code)
  // ═══════════════════════════════════════════

  'claude-code-ch1-s1': {
    title: '💻 Claude Code란? AI 코딩 도우미',
    description: 'Claude Code는 AI가 코딩을 도와주는 프로그램이에요! AI에게 명령을 내려서 코드를 만드는 것을 체험해봐요.',
    initialCode: `# Claude Code처럼 명령어로 코드 만들기!
def AI코딩도우미(명령어):
    코드사전 = {
        "인사하기": 'print("안녕하세요!")',
        "더하기": 'print(3 + 5)',
        "반복하기": 'for i in range(3): print(i)',
        "리스트": 'fruits = ["사과", "바나나"]',
    }

    if 명령어 in 코드사전:
        return f"✅ 코드 생성: {코드사전[명령어]}"
    else:
        return "❓ 모르는 명령어예요. 다시 시도해보세요!"

# AI에게 명령 내리기!
명령들 = ["인사하기", "더하기", "반복하기", "날씨알려줘"]
for 명령 in 명령들:
    print(f"명령: {명령}")
    print(f"  {AI코딩도우미(명령)}")`,
    expectedOutput: '명령: 인사하기\n  ✅ 코드 생성: print("안녕하세요!")\n명령: 더하기\n  ✅ 코드 생성: print(3 + 5)\n명령: 반복하기\n  ✅ 코드 생성: for i in range(3): print(i)\n명령: 날씨알려줘\n  ❓ 모르는 명령어예요. 다시 시도해보세요!',
    hint: 'Claude Code도 이와 비슷해요! 우리가 "인사 코드 만들어줘"라고 하면 AI가 코드를 만들어줘요.',
    packages: [],
  },

  'claude-code-ch2-s1': {
    title: '⚡ 슬래시 명령어 시뮬레이션',
    description: 'Claude Code에서는 /로 시작하는 명령어를 써서 AI에게 일을 시킬 수 있어요! 슬래시 명령어 시스템을 만들어봐요.',
    initialCode: `# 슬래시 명령어 시스템 만들기!
def 명령어실행(명령):
    if 명령 == "/help":
        return "사용 가능한 명령어: /help, /clear, /status, /run"
    elif 명령 == "/clear":
        return "🧹 화면을 깨끗이 지웠어요!"
    elif 명령 == "/status":
        return "✅ 시스템 정상 작동 중!"
    elif 명령 == "/run":
        return "🚀 코드를 실행합니다!"
    else:
        return f"❌ '{명령}'은 알 수 없는 명령어예요"

# 명령어 테스트!
명령목록 = ["/help", "/status", "/run", "/clear", "/dance"]
for 명령 in 명령목록:
    결과 = 명령어실행(명령)
    print(f"{명령} → {결과}")`,
    expectedOutput: '/help → 사용 가능한 명령어: /help, /clear, /status, /run\n/status → ✅ 시스템 정상 작동 중!\n/run → 🚀 코드를 실행합니다!\n/clear → 🧹 화면을 깨끗이 지웠어요!\n/dance → ❌ \'/dance\'은 알 수 없는 명령어예요',
    hint: 'Claude Code에서도 /help, /clear 같은 슬래시 명령어를 사용해요. if/elif로 각 명령어를 처리하는 거예요!',
    packages: [],
  },

  // ═══════════════════════════════════════════
  // Claude 헌법 (claude-constitution)
  // ═══════════════════════════════════════════

  'claude-constitution-ch1-s2': {
    title: '📜 AI 핵심 가치 만들기',
    description: 'Claude에게는 "헌법"이라는 규칙이 있어요! AI가 지켜야 할 핵심 가치를 직접 만들어봐요.',
    initialCode: `# AI 헌법 만들기!
class AI헌법:
    def __init__(self):
        self.가치 = []

    def 가치추가(self, 이름, 설명):
        self.가치.append({"이름": 이름, "설명": 설명})

    def 검사(self, 행동):
        위반 = []
        규칙 = {"거짓말": "정직", "차별": "공정", "위험": "안전"}
        for 키워드, 가치이름 in 규칙.items():
            if 키워드 in 행동:
                위반.append(가치이름)
        return 위반

헌법 = AI헌법()
헌법.가치추가("정직", "거짓말하지 않기")
헌법.가치추가("공정", "모든 사람을 평등하게")
헌법.가치추가("안전", "위험한 일 하지 않기")

print("📜 AI 핵심 가치:")
for v in 헌법.가치:
    print(f"  ⭐ {v['이름']}: {v['설명']}")

# 행동 검사!
행동들 = ["친절하게 도와주기", "거짓말로 속이기", "차별하는 답변"]
print("\\n🔍 행동 검사:")
for 행동 in 행동들:
    위반 = 헌법.검사(행동)
    if 위반:
        print(f"  ❌ '{행동}' → 위반: {', '.join(위반)}")
    else:
        print(f"  ✅ '{행동}' → 통과!")`,
    expectedOutput: '📜 AI 핵심 가치:\n  ⭐ 정직: 거짓말하지 않기\n  ⭐ 공정: 모든 사람을 평등하게\n  ⭐ 안전: 위험한 일 하지 않기\n\n🔍 행동 검사:\n  ✅ \'친절하게 도와주기\' → 통과!\n  ❌ \'거짓말로 속이기\' → 위반: 정직\n  ❌ \'차별하는 답변\' → 위반: 공정',
    hint: 'Claude의 헌법은 AI가 나쁜 행동을 하지 않도록 규칙을 정해둔 거예요. 키워드로 위반을 감지해요!',
    packages: [],
  },

  'claude-constitution-ch2-s1': {
    title: '🔄 자기비판 시뮬레이션',
    description: 'Claude는 자기가 한 답변을 스스로 검토하고 더 좋게 만들어요! AI가 자기비판하는 과정을 체험해봐요.',
    initialCode: `# AI 자기비판 시스템!
def AI답변(질문):
    return f"'{질문}'에 대한 답변입니다."

def 자기비판(답변):
    문제점 = []
    if len(답변) < 15:
        문제점.append("너무 짧아요")
    if "모르겠" in 답변:
        문제점.append("확실하지 않아요")
    if "아마" in 답변:
        문제점.append("추측이 포함돼요")
    return 문제점

def 개선하기(답변, 문제점):
    if "너무 짧아요" in 문제점:
        답변 += " (더 자세히 설명할게요!)"
    if "추측이 포함돼요" in 문제점:
        답변 = 답변.replace("아마", "확인 결과")
    return 답변

# 테스트!
답변들 = ["네.", "아마 맞을 거예요.", "Python은 프로그래밍 언어예요!"]
for 답변 in 답변들:
    문제 = 자기비판(답변)
    print(f"원본: {답변}")
    if 문제:
        개선 = 개선하기(답변, 문제)
        print(f"  문제: {', '.join(문제)}")
        print(f"  개선: {개선}")
    else:
        print(f"  ✅ 좋은 답변!")`,
    expectedOutput: '원본: 네.\n  문제: 너무 짧아요\n  개선: 네. (더 자세히 설명할게요!)\n원본: 아마 맞을 거예요.\n  문제: 추측이 포함돼요\n  개선: 확인 결과 맞을 거예요.\n원본: Python은 프로그래밍 언어예요!\n  ✅ 좋은 답변!',
    hint: 'Claude는 답변을 만든 후 스스로 "이게 괜찮은가?"를 체크해요. 문제가 있으면 수정하는 거예요!',
    packages: [],
  },

  // ═══════════════════════════════════════════
  // Claude Code 중급 (claude-code-intermediate)
  // ═══════════════════════════════════════════

  'claude-code-intermediate-ch1-s1': {
    title: '📝 CLAUDE.md 설정 파일 만들기',
    description: 'CLAUDE.md는 AI에게 프로젝트 규칙을 알려주는 파일이에요! 설정 파일을 읽고 규칙을 적용하는 프로그램을 만들어봐요.',
    initialCode: `# CLAUDE.md 설정 파일 시뮬레이션!
설정 = {
    "프로젝트이름": "나의 첫 앱",
    "언어": "Python",
    "규칙": ["변수는 한글로", "주석 꼭 달기", "함수는 10줄 이하"],
    "금지사항": ["전역변수 사용", "print 디버깅"],
}

print(f"📋 프로젝트: {설정['프로젝트이름']}")
print(f"🔧 언어: {설정['언어']}")
print("\\n✅ 규칙:")
for i, 규칙 in enumerate(설정["규칙"], 1):
    print(f"  {i}. {규칙}")
print("\\n🚫 금지사항:")
for 항목 in 설정["금지사항"]:
    print(f"  ❌ {항목}")

# 코드 검사!
코드 = "total = sum(numbers)  # 합계 계산"
위반 = []
if "global" in 코드:
    위반.append("전역변수 사용")
print(f"\\n🔍 코드 검사: 위반 {len(위반)}건")`,
    expectedOutput: '📋 프로젝트: 나의 첫 앱\n🔧 언어: Python\n\n✅ 규칙:\n  1. 변수는 한글로\n  2. 주석 꼭 달기\n  3. 함수는 10줄 이하\n\n🚫 금지사항:\n  ❌ 전역변수 사용\n  ❌ print 디버깅\n\n🔍 코드 검사: 위반 0건',
    hint: 'CLAUDE.md 파일은 AI에게 "이 프로젝트에서는 이런 규칙을 지켜줘"라고 알려주는 설명서예요!',
    packages: [],
  },

  'claude-code-intermediate-ch3-s1': {
    title: '🧪 테스트 코드 만들기',
    description: '테스트는 코드가 올바르게 동작하는지 확인하는 거예요! 간단한 테스트 시스템을 만들어봐요.',
    initialCode: `# 간단한 테스트 시스템 만들기!
def 테스트실행(이름, 결과, 기대값):
    if 결과 == 기대값:
        print(f"  ✅ {이름}: 통과!")
        return True
    else:
        print(f"  ❌ {이름}: 실패! (결과: {결과}, 기대: {기대값})")
        return False

# 테스트할 함수
def 더하기(a, b):
    return a + b

def 최대값(리스트):
    return max(리스트)

# 테스트 실행!
print("🧪 테스트 결과:")
통과 = 0
총수 = 0

총수 += 1
if 테스트실행("더하기(2,3)", 더하기(2, 3), 5): 통과 += 1
총수 += 1
if 테스트실행("더하기(-1,1)", 더하기(-1, 1), 0): 통과 += 1
총수 += 1
if 테스트실행("최대값([3,1,2])", 최대값([3, 1, 2]), 3): 통과 += 1
총수 += 1
if 테스트실행("최대값([5])", 최대값([5]), 5): 통과 += 1

print(f"\\n결과: {통과}/{총수} 통과")`,
    expectedOutput: '🧪 테스트 결과:\n  ✅ 더하기(2,3): 통과!\n  ✅ 더하기(-1,1): 통과!\n  ✅ 최대값([3,1,2]): 통과!\n  ✅ 최대값([5]): 통과!\n\n결과: 4/4 통과',
    hint: '테스트는 함수의 결과가 기대한 값과 같은지 확인해요. 모든 테스트가 통과하면 코드가 정확한 거예요!',
    packages: [],
  },

  // ═══════════════════════════════════════════
  // Claude Code 고급 (claude-code-advanced)
  // ═══════════════════════════════════════════

  'claude-code-advanced-ch1-s1': {
    title: '🤖 에이전트 시스템 만들기',
    description: '에이전트는 스스로 판단하고 행동하는 AI예요! 간단한 에이전트가 문제를 풀어가는 과정을 만들어봐요.',
    initialCode: `# 간단한 AI 에이전트!
class 에이전트:
    def __init__(self, 이름):
        self.이름 = 이름
        self.기록 = []

    def 생각하기(self, 문제):
        self.기록.append(f"🤔 생각: {문제}")
        if "계산" in 문제:
            return "계산하기"
        elif "찾기" in 문제:
            return "검색하기"
        else:
            return "분석하기"

    def 행동하기(self, 행동):
        self.기록.append(f"⚡ 행동: {행동}")
        return f"{행동} 완료!"

    def 보고서(self):
        print(f"📋 {self.이름} 에이전트 활동 기록:")
        for 항목 in self.기록:
            print(f"  {항목}")

봇 = 에이전트("똑똑이")
문제들 = ["숫자 계산 해줘", "파일 찾기", "데이터 정리"]
for 문제 in 문제들:
    계획 = 봇.생각하기(문제)
    결과 = 봇.행동하기(계획)
    print(f"{문제} → {결과}")

print()
봇.보고서()`,
    expectedOutput: '숫자 계산 해줘 → 계산하기 완료!\n파일 찾기 → 검색하기 완료!\n데이터 정리 → 분석하기 완료!\n\n📋 똑똑이 에이전트 활동 기록:\n  🤔 생각: 숫자 계산 해줘\n  ⚡ 행동: 계산하기\n  🤔 생각: 파일 찾기\n  ⚡ 행동: 검색하기\n  🤔 생각: 데이터 정리\n  ⚡ 행동: 분석하기',
    hint: '에이전트는 "생각 → 행동 → 결과" 순서로 일해요. 문제를 보고 어떤 행동을 할지 스스로 결정하는 거예요!',
    packages: [],
  },

  'claude-code-advanced-ch2-s1': {
    title: '🔌 MCP 서버 시뮬레이션',
    description: 'MCP는 AI가 외부 도구를 사용할 수 있게 해주는 프로토콜이에요! 요청과 응답을 주고받는 시스템을 만들어봐요.',
    initialCode: `# MCP 서버 시뮬레이션!
class MCP서버:
    def __init__(self):
        self.도구들 = {}

    def 도구등록(self, 이름, 기능):
        self.도구들[이름] = 기능
        print(f"🔧 도구 등록: {이름}")

    def 요청처리(self, 도구이름, 입력값):
        if 도구이름 in self.도구들:
            결과 = self.도구들[도구이름](입력값)
            return {"상태": "성공", "결과": 결과}
        return {"상태": "실패", "결과": "도구를 찾을 수 없어요"}

# 서버 만들기
서버 = MCP서버()
서버.도구등록("계산기", lambda x: eval(x))
서버.도구등록("대문자", lambda x: x.upper())
서버.도구등록("글자수", lambda x: len(x))

# 요청 보내기!
print("\\n📡 요청 처리:")
요청들 = [("계산기", "10 + 20"), ("대문자", "hello"), ("글자수", "안녕하세요")]
for 도구, 입력 in 요청들:
    응답 = 서버.요청처리(도구, 입력)
    print(f"  {도구}({입력}) → {응답['결과']}")`,
    expectedOutput: '🔧 도구 등록: 계산기\n🔧 도구 등록: 대문자\n🔧 도구 등록: 글자수\n\n📡 요청 처리:\n  계산기(10 + 20) → 30\n  대문자(hello) → HELLO\n  글자수(안녕하세요) → 5',
    hint: 'MCP는 AI가 "계산기 좀 써줘"라고 요청하면 서버가 계산 결과를 돌려주는 방식이에요!',
    packages: [],
  },

  // ═══════════════════════════════════════════
  // Claude Cowork (claude-cowork)
  // ═══════════════════════════════════════════

  'claude-cowork-ch1-s1': {
    title: '🤝 AI 협업이란?',
    description: 'AI와 사람이 함께 일하는 것을 협업이라고 해요! 사람과 AI가 각자 잘하는 일을 나눠서 하는 시스템을 만들어봐요.',
    initialCode: `# 사람과 AI의 협업 시뮬레이션!
def 사람역할(작업):
    잘하는것 = ["창의적 아이디어", "감정 이해", "윤리 판단"]
    for 능력 in 잘하는것:
        if 능력 in 작업:
            return f"👤 사람이 처리: {작업}"
    return None

def AI역할(작업):
    잘하는것 = ["데이터 분석", "반복 계산", "패턴 찾기"]
    for 능력 in 잘하는것:
        if 능력 in 작업:
            return f"🤖 AI가 처리: {작업}"
    return None

# 작업 분배!
작업들 = ["데이터 분석 하기", "창의적 아이디어 내기",
         "반복 계산 수행", "감정 이해 필요"]

print("📋 작업 분배 결과:")
for 작업 in 작업들:
    결과 = 사람역할(작업) or AI역할(작업) or f"🤝 함께 처리: {작업}"
    print(f"  {결과}")`,
    expectedOutput: '📋 작업 분배 결과:\n  🤖 AI가 처리: 데이터 분석 하기\n  👤 사람이 처리: 창의적 아이디어 내기\n  🤖 AI가 처리: 반복 계산 수행\n  👤 사람이 처리: 감정 이해 필요',
    hint: 'AI는 계산과 분석을 잘하고, 사람은 창의력과 감정을 잘 다뤄요. 함께하면 더 좋은 결과가 나와요!',
    packages: [],
  },

  'claude-cowork-ch2-s1': {
    title: '📁 파일 관리 시스템',
    description: 'AI와 협업할 때 파일을 잘 정리하는 것이 중요해요! 간단한 파일 관리 시스템을 만들어봐요.',
    initialCode: `# 파일 관리 시스템 만들기!
class 파일관리자:
    def __init__(self):
        self.파일들 = {}

    def 파일추가(self, 폴더, 파일이름):
        if 폴더 not in self.파일들:
            self.파일들[폴더] = []
        self.파일들[폴더].append(파일이름)

    def 목록보기(self):
        for 폴더, 파일 in self.파일들.items():
            print(f"📂 {폴더}/")
            for f in sorted(파일):
                print(f"  📄 {f}")

    def 검색(self, 키워드):
        결과 = []
        for 폴더, 파일 in self.파일들.items():
            for f in 파일:
                if 키워드 in f:
                    결과.append(f"{폴더}/{f}")
        return 결과

관리자 = 파일관리자()
관리자.파일추가("src", "main.py")
관리자.파일추가("src", "utils.py")
관리자.파일추가("docs", "설명서.md")
관리자.파일추가("docs", "가이드.md")
관리자.파일추가("tests", "test_main.py")

관리자.목록보기()
print(f"\\n🔍 '.py' 검색: {관리자.검색('.py')}")`,
    expectedOutput: '📂 src/\n  📄 main.py\n  📄 utils.py\n📂 docs/\n  📄 가이드.md\n  📄 설명서.md\n📂 tests/\n  📄 test_main.py\n\n🔍 \'.py\' 검색: [\'src/main.py\', \'src/utils.py\', \'tests/test_main.py\']',
    hint: '파일을 폴더별로 정리하면 AI도 사람도 필요한 파일을 빨리 찾을 수 있어요!',
    packages: [],
  },

  // ═══════════════════════════════════════════
  // 에이전트 스킬 (agent-skills)
  // ═══════════════════════════════════════════

  'agent-skills-ch1-s1': {
    title: '🤖 AI 에이전트란?',
    description: '에이전트는 목표를 받으면 스스로 계획을 세우고 실행하는 AI예요! 할일 목록을 자동으로 처리하는 에이전트를 만들어봐요.',
    initialCode: `# 할일 처리 에이전트!
class 할일에이전트:
    def __init__(self):
        self.할일 = []
        self.완료 = []

    def 할일추가(self, 작업):
        self.할일.append(작업)

    def 실행(self):
        print("🤖 에이전트 시작!")
        while self.할일:
            작업 = self.할일.pop(0)
            print(f"  ⚙️ 처리 중: {작업}")
            self.완료.append(작업)
            print(f"  ✅ 완료: {작업}")
        print(f"\\n📊 총 {len(self.완료)}개 작업 완료!")

에이전트 = 할일에이전트()
에이전트.할일추가("코드 작성")
에이전트.할일추가("테스트 실행")
에이전트.할일추가("버그 수정")
에이전트.실행()`,
    expectedOutput: '🤖 에이전트 시작!\n  ⚙️ 처리 중: 코드 작성\n  ✅ 완료: 코드 작성\n  ⚙️ 처리 중: 테스트 실행\n  ✅ 완료: 테스트 실행\n  ⚙️ 처리 중: 버그 수정\n  ✅ 완료: 버그 수정\n\n📊 총 3개 작업 완료!',
    hint: '에이전트는 할일 목록에서 하나씩 꺼내서 처리하고 완료 목록에 넣어요. 모든 할일이 끝날 때까지 반복해요!',
    packages: [],
  },

  'agent-skills-ch2-s1': {
    title: '🎯 스킬이란?',
    description: '스킬은 에이전트가 가지고 있는 특별한 능력이에요! 다양한 스킬을 가진 에이전트를 만들어봐요.',
    initialCode: `# 스킬을 가진 에이전트!
class 스킬에이전트:
    def __init__(self, 이름):
        self.이름 = 이름
        self.스킬 = {}

    def 스킬배우기(self, 스킬이름, 기능):
        self.스킬[스킬이름] = 기능
        print(f"📚 {self.이름}이 '{스킬이름}' 스킬을 배웠어요!")

    def 스킬사용(self, 스킬이름, 입력):
        if 스킬이름 in self.스킬:
            return self.스킬[스킬이름](입력)
        return "아직 배우지 못한 스킬이에요"

봇 = 스킬에이전트("학습봇")
봇.스킬배우기("합계", lambda x: sum(x))
봇.스킬배우기("평균", lambda x: sum(x)/len(x))
봇.스킬배우기("최대", lambda x: max(x))

숫자들 = [10, 20, 30, 40, 50]
print(f"\\n📊 데이터: {숫자들}")
print(f"합계 스킬: {봇.스킬사용('합계', 숫자들)}")
print(f"평균 스킬: {봇.스킬사용('평균', 숫자들)}")
print(f"최대 스킬: {봇.스킬사용('최대', 숫자들)}")`,
    expectedOutput: '📚 학습봇이 \'합계\' 스킬을 배웠어요!\n📚 학습봇이 \'평균\' 스킬을 배웠어요!\n📚 학습봇이 \'최대\' 스킬을 배웠어요!\n\n📊 데이터: [10, 20, 30, 40, 50]\n합계 스킬: 150\n평균 스킬: 30.0\n최대 스킬: 50',
    hint: '스킬은 에이전트가 할 수 있는 일이에요. 새 스킬을 배우면 더 많은 일을 할 수 있어요!',
    packages: [],
  },

  // ═══════════════════════════════════════════
  // Claude Tool Use (claude-tool-use)
  // ═══════════════════════════════════════════

  'claude-tool-use-ch1-s1': {
    title: '📞 함수 호출이란?',
    description: 'AI가 도구를 사용하려면 함수를 호출해야 해요! 함수 호출이 어떻게 작동하는지 체험해봐요.',
    initialCode: `# AI의 함수 호출 시뮬레이션!
def 날씨확인(도시):
    날씨DB = {"서울": "맑음 ☀️", "부산": "흐림 ☁️", "제주": "비 🌧️"}
    return 날씨DB.get(도시, "정보없음")

def 계산하기(식):
    return eval(식)

def 번역하기(단어):
    사전 = {"사과": "apple", "바나나": "banana", "딸기": "strawberry"}
    return 사전.get(단어, "번역불가")

# AI가 함수를 호출하는 과정!
호출목록 = [
    ("날씨확인", "서울"),
    ("계산하기", "15 * 4"),
    ("번역하기", "딸기"),
]

함수들 = {"날씨확인": 날씨확인, "계산하기": 계산하기, "번역하기": 번역하기}

print("🤖 AI 함수 호출 결과:")
for 함수이름, 입력값 in 호출목록:
    결과 = 함수들[함수이름](입력값)
    print(f"  {함수이름}({입력값}) → {결과}")`,
    expectedOutput: '🤖 AI 함수 호출 결과:\n  날씨확인(서울) → 맑음 ☀️\n  계산하기(15 * 4) → 60\n  번역하기(딸기) → strawberry',
    hint: 'AI는 필요한 도구(함수)를 골라서 입력값을 넣고 결과를 받아요. 마치 전화를 거는 것처럼요!',
    packages: [],
  },

  'claude-tool-use-ch1-s3': {
    title: '🔧 나만의 도구 만들기',
    description: '도구는 AI가 사용할 수 있는 기능이에요! 직접 도구를 만들고 등록하는 시스템을 구현해봐요.',
    initialCode: `# 도구 등록 시스템!
class 도구상자:
    def __init__(self):
        self.도구들 = {}

    def 등록(self, 이름, 설명, 기능):
        self.도구들[이름] = {"설명": 설명, "기능": 기능}

    def 목록(self):
        print("🧰 사용 가능한 도구:")
        for 이름, 정보 in self.도구들.items():
            print(f"  🔧 {이름}: {정보['설명']}")

    def 사용(self, 이름, 입력):
        if 이름 in self.도구들:
            return self.도구들[이름]["기능"](입력)
        return "도구를 찾을 수 없어요!"

상자 = 도구상자()
상자.등록("글자세기", "글자 수를 세요", len)
상자.등록("거꾸로", "글자를 뒤집어요", lambda x: x[::-1])
상자.등록("대문자", "대문자로 바꿔요", lambda x: x.upper())

상자.목록()
print()
테스트 = "hello"
print(f"입력: {테스트}")
print(f"글자세기: {상자.사용('글자세기', 테스트)}")
print(f"거꾸로: {상자.사용('거꾸로', 테스트)}")
print(f"대문자: {상자.사용('대문자', 테스트)}")`,
    expectedOutput: '🧰 사용 가능한 도구:\n  🔧 글자세기: 글자 수를 세요\n  🔧 거꾸로: 글자를 뒤집어요\n  🔧 대문자: 대문자로 바꿔요\n\n입력: hello\n글자세기: 5\n거꾸로: olleh\n대문자: HELLO',
    hint: '도구를 등록하면 AI가 필요할 때 꺼내 쓸 수 있어요. 이름, 설명, 기능을 함께 등록해요!',
    packages: [],
  },

  // ═══════════════════════════════════════════
  // Claude Vision (claude-vision)
  // ═══════════════════════════════════════════

  'claude-vision-ch1-s1': {
    title: '👁️ AI 비전 기능 체험',
    description: 'AI 비전은 이미지를 보고 이해하는 기능이에요! 숫자 격자를 이미지처럼 분석하는 프로그램을 만들어봐요.',
    initialCode: `# AI 비전처럼 이미지 분석하기!
# 숫자로 표현된 간단한 이미지

이미지 = [
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
    [1, 1, 1, 1, 1],
    [0, 1, 1, 1, 0],
    [0, 0, 1, 0, 0],
]

# 이미지 분석!
전체픽셀 = 0
밝은픽셀 = 0
for 행 in 이미지:
    for 값 in 행:
        전체픽셀 += 1
        if 값 == 1:
            밝은픽셀 += 1

비율 = round(밝은픽셀 / 전체픽셀 * 100, 1)

print("🖼️ 이미지 분석 결과:")
print(f"  크기: {len(이미지)}x{len(이미지[0])}")
print(f"  밝은 픽셀: {밝은픽셀}개")
print(f"  밝은 비율: {비율}%")

# 모양 추측!
if 비율 > 40:
    print("  모양: ◆ 다이아몬드 같아요!")
else:
    print("  모양: 점이 적어서 판단 어려워요")`,
    expectedOutput: '🖼️ 이미지 분석 결과:\n  크기: 5x5\n  밝은 픽셀: 13개\n  밝은 비율: 52.0%\n  모양: ◆ 다이아몬드 같아요!',
    hint: 'AI 비전은 이미지의 픽셀(점)을 하나씩 분석해서 무엇이 있는지 알아내요. 1이 밝은 점, 0이 어두운 점이에요!',
    packages: [],
  },

  'claude-vision-ch2-s1': {
    title: '📄 문서 이해 시뮬레이션',
    description: 'AI는 문서를 읽고 중요한 정보를 찾아낼 수 있어요! 텍스트에서 핵심 정보를 추출하는 프로그램을 만들어봐요.',
    initialCode: `# 문서에서 정보 추출하기!
문서 = """
학생 성적표
이름: 김민수
학년: 5학년
과목: 수학 95점, 영어 88점, 과학 92점
출석: 180일 / 180일
"""

# 정보 추출!
def 정보추출(텍스트, 키워드):
    for 줄 in 텍스트.strip().split("\\n"):
        if 키워드 in 줄:
            return 줄.split(": ")[-1].strip()
    return "찾을 수 없음"

print("📄 문서 분석 결과:")
print(f"  이름: {정보추출(문서, '이름')}")
print(f"  학년: {정보추출(문서, '학년')}")
print(f"  과목: {정보추출(문서, '과목')}")
print(f"  출석: {정보추출(문서, '출석')}")

# 숫자 추출
import re
점수들 = [int(x) for x in re.findall(r'(\\d+)점', 문서)]
print(f"\\n📊 점수 분석:")
print(f"  평균: {sum(점수들)/len(점수들):.1f}점")`,
    expectedOutput: '📄 문서 분석 결과:\n  이름: 김민수\n  학년: 5학년\n  과목: 수학 95점, 영어 88점, 과학 92점\n  출석: 180일 / 180일\n\n📊 점수 분석:\n  평균: 91.7점',
    hint: '문서에서 키워드를 찾아 그 줄의 정보를 추출해요. AI도 이와 비슷하게 문서를 분석해요!',
    packages: [],
  },

  // ═══════════════════════════════════════════
  // 확장 사고 (extended-thinking)
  // ═══════════════════════════════════════════

  'extended-thinking-ch1-s1': {
    title: '🧠 확장 사고란?',
    description: '확장 사고는 AI가 어려운 문제를 풀 때 단계별로 깊이 생각하는 거예요! 문제를 단계별로 풀어보는 체험을 해봐요.',
    initialCode: `# 확장 사고 시뮬레이션!
def 단계별사고(문제):
    print(f"❓ 문제: {문제}")
    print("🧠 사고 과정:")
    단계 = []

    if "+" in 문제 or "더하기" in 문제:
        단계.append("1단계: 숫자를 찾아요")
        단계.append("2단계: 더하기를 해요")
        단계.append("3단계: 답을 확인해요")
    elif "비교" in 문제:
        단계.append("1단계: 비교할 대상을 찾아요")
        단계.append("2단계: 기준을 정해요")
        단계.append("3단계: 하나씩 비교해요")

    for 단 in 단계:
        print(f"  {단}")
    return len(단계)

문제들 = ["23 + 45 더하기", "키 비교 하기"]
총단계 = 0
for 문제 in 문제들:
    n = 단계별사고(문제)
    총단계 += n
    print()
print(f"총 사고 단계: {총단계}단계")`,
    expectedOutput: '❓ 문제: 23 + 45 더하기\n🧠 사고 과정:\n  1단계: 숫자를 찾아요\n  2단계: 더하기를 해요\n  3단계: 답을 확인해요\n\n❓ 문제: 키 비교 하기\n🧠 사고 과정:\n  1단계: 비교할 대상을 찾아요\n  2단계: 기준을 정해요\n  3단계: 하나씩 비교해요\n\n총 사고 단계: 6단계',
    hint: '확장 사고는 복잡한 문제를 작은 단계로 나눠서 하나씩 풀어가는 거예요. 사람이 생각하는 것처럼요!',
    packages: [],
  },

  'extended-thinking-ch3-s1': {
    title: '🔢 수학 추론 체험',
    description: 'AI가 수학 문제를 풀 때는 단계별로 추론해요! 직접 수학 풀이 과정을 만들어봐요.',
    initialCode: `# AI의 수학 추론 과정!
def 수학풀이(문제, 숫자들):
    print(f"📝 문제: {문제}")
    print("풀이 과정:")

    if "합" in 문제:
        print(f"  1단계: 숫자 확인 → {숫자들}")
        합계 = sum(숫자들)
        print(f"  2단계: 모두 더하기 → {' + '.join(map(str, 숫자들))} = {합계}")
        평균 = 합계 / len(숫자들)
        print(f"  3단계: 평균 구하기 → {합계} ÷ {len(숫자들)} = {평균}")
        print(f"  💡 답: 합계={합계}, 평균={평균}")
    elif "최대" in 문제:
        정렬 = sorted(숫자들, reverse=True)
        print(f"  1단계: 크기순 정렬 → {정렬}")
        print(f"  2단계: 가장 큰 수 → {정렬[0]}")
        print(f"  💡 답: 최대값={정렬[0]}")

수학풀이("합과 평균 구하기", [10, 20, 30, 40])
print()
수학풀이("최대값 찾기", [15, 42, 8, 31])`,
    expectedOutput: '📝 문제: 합과 평균 구하기\n풀이 과정:\n  1단계: 숫자 확인 → [10, 20, 30, 40]\n  2단계: 모두 더하기 → 10 + 20 + 30 + 40 = 100\n  3단계: 평균 구하기 → 100 ÷ 4 = 25.0\n  💡 답: 합계=100, 평균=25.0\n\n📝 문제: 최대값 찾기\n풀이 과정:\n  1단계: 크기순 정렬 → [42, 31, 15, 8]\n  2단계: 가장 큰 수 → 42\n  💡 답: 최대값=42',
    hint: 'AI도 수학 문제를 풀 때 사람처럼 단계별로 풀어가요. 큰 문제를 작은 단계로 나누면 쉬워져요!',
    packages: [],
  },

  // ═══════════════════════════════════════════
  // 프롬프트 엔지니어링 (prompt-engineering)
  // ═══════════════════════════════════════════

  'prompt-engineering-ch1-s1': {
    title: '💬 프롬프트란?',
    description: '프롬프트는 AI에게 내리는 명령이에요! 같은 질문이라도 프롬프트를 어떻게 쓰느냐에 따라 답이 달라져요.',
    initialCode: `# 프롬프트에 따라 달라지는 AI 답변!
def AI응답(프롬프트):
    if "자세히" in 프롬프트:
        return "Python은 1991년 만들어진 프로그래밍 언어로, 읽기 쉽고 배우기 쉬워요!"
    elif "한줄로" in 프롬프트:
        return "Python = 쉬운 프로그래밍 언어"
    elif "비유로" in 프롬프트:
        return "Python은 레고 블록 같아요. 조립하면 뭐든 만들 수 있어요!"
    else:
        return "Python은 프로그래밍 언어예요."

# 같은 주제, 다른 프롬프트!
프롬프트들 = [
    "Python이 뭐야?",
    "Python이 뭔지 자세히 알려줘",
    "Python이 뭔지 한줄로 알려줘",
    "Python이 뭔지 비유로 설명해줘",
]

print("🎯 프롬프트 실험:")
for p in 프롬프트들:
    print(f"\\n질문: {p}")
    print(f"답변: {AI응답(p)}")`,
    expectedOutput: '🎯 프롬프트 실험:\n\n질문: Python이 뭐야?\n답변: Python은 프로그래밍 언어예요.\n\n질문: Python이 뭔지 자세히 알려줘\n답변: Python은 1991년 만들어진 프로그래밍 언어로, 읽기 쉽고 배우기 쉬워요!\n\n질문: Python이 뭔지 한줄로 알려줘\n답변: Python = 쉬운 프로그래밍 언어\n\n질문: Python이 뭔지 비유로 설명해줘\n답변: Python은 레고 블록 같아요. 조립하면 뭐든 만들 수 있어요!',
    hint: '프롬프트를 잘 쓰면 원하는 답을 정확하게 받을 수 있어요. "자세히", "한줄로", "비유로" 같은 말이 중요해요!',
    packages: [],
  },

  'prompt-engineering-ch2-s2': {
    title: '🎭 역할 설정 프롬프트',
    description: 'AI에게 역할을 주면 그 역할에 맞는 답변을 해요! 선생님, 요리사 등 다양한 역할을 실험해봐요.',
    initialCode: `# AI에게 역할을 부여하기!
def 역할AI(역할, 질문):
    답변사전 = {
        "선생님": {
            "사과": "사과는 장미과의 과일로, 비타민이 풍부해요!",
            "물": "물은 H2O라는 분자로 이루어져 있어요!",
        },
        "요리사": {
            "사과": "사과는 파이나 잼으로 만들면 맛있어요!",
            "물": "물은 요리의 기본! 육수 만들 때 꼭 필요해요!",
        },
        "시인": {
            "사과": "빨갛게 물든 사과, 가을의 선물이로다~",
            "물": "흐르고 흘러 바다에 이르는 물, 끝없는 여행~",
        },
    }
    return 답변사전.get(역할, {}).get(질문, "모르겠어요")

# 같은 질문, 다른 역할!
역할들 = ["선생님", "요리사", "시인"]
질문들 = ["사과", "물"]

for 질문 in 질문들:
    print(f"🍎 '{질문}'에 대한 답변:")
    for 역할 in 역할들:
        print(f"  [{역할}] {역할AI(역할, 질문)}")
    print()`,
    expectedOutput: '🍎 \'사과\'에 대한 답변:\n  [선생님] 사과는 장미과의 과일로, 비타민이 풍부해요!\n  [요리사] 사과는 파이나 잼으로 만들면 맛있어요!\n  [시인] 빨갛게 물든 사과, 가을의 선물이로다~\n\n🍎 \'물\'에 대한 답변:\n  [선생님] 물은 H2O라는 분자로 이루어져 있어요!\n  [요리사] 물은 요리의 기본! 육수 만들 때 꼭 필요해요!\n  [시인] 흐르고 흘러 바다에 이르는 물, 끝없는 여행~\n',
    hint: '역할을 바꾸면 같은 질문에도 완전히 다른 답이 나와요. 이것이 "역할 설정 프롬프트"의 힘이에요!',
    packages: [],
  },

  // ═══════════════════════════════════════════
  // MCP 마스터리 (mcp-mastery)
  // ═══════════════════════════════════════════

  'mcp-mastery-ch1-s1': {
    title: '🔌 MCP란?',
    description: 'MCP(Model Context Protocol)는 AI가 외부 도구와 대화하는 약속이에요! 프로토콜이 어떻게 작동하는지 체험해봐요.',
    initialCode: `# MCP 프로토콜 시뮬레이션!
import json

def MCP요청만들기(도구, 매개변수):
    return {"method": "call_tool", "tool": 도구, "params": 매개변수}

def MCP응답만들기(결과):
    return {"status": "ok", "result": 결과}

# 요청과 응답 주고받기!
요청들 = [
    MCP요청만들기("날씨", {"도시": "서울"}),
    MCP요청만들기("번역", {"텍스트": "안녕", "언어": "영어"}),
    MCP요청만들기("계산", {"식": "100 + 200"}),
]

print("📡 MCP 통신:")
for 요청 in 요청들:
    도구 = 요청["tool"]
    매개 = 요청["params"]
    print(f"\\n  → 요청: {도구}({매개})")

    if 도구 == "날씨":
        응답 = MCP응답만들기("맑음 25도")
    elif 도구 == "번역":
        응답 = MCP응답만들기("Hello")
    elif 도구 == "계산":
        응답 = MCP응답만들기(300)

    print(f"  ← 응답: {응답['result']}")`,
    expectedOutput: '📡 MCP 통신:\n\n  → 요청: 날씨({\'도시\': \'서울\'})\n  ← 응답: 맑음 25도\n\n  → 요청: 번역({\'텍스트\': \'안녕\', \'언어\': \'영어\'})\n  ← 응답: Hello\n\n  → 요청: 계산({\'식\': \'100 + 200\'})\n  ← 응답: 300',
    hint: 'MCP는 AI가 도구에게 "이것 좀 해줘"라고 요청하고, 도구가 결과를 돌려주는 약속이에요!',
    packages: [],
  },

  'mcp-mastery-ch3-s2': {
    title: '🏗️ MCP 서버 만들기',
    description: '직접 MCP 서버를 만들어서 도구를 제공하는 프로그램을 만들어봐요! 서버가 여러 도구를 관리해요.',
    initialCode: `# 나만의 MCP 서버!
class MCP서버:
    def __init__(self, 이름):
        self.이름 = 이름
        self.도구목록 = {}

    def 도구추가(self, 이름, 설명, 처리함수):
        self.도구목록[이름] = {"설명": 설명, "함수": 처리함수}

    def 도구리스트(self):
        print(f"🖥️ [{self.이름}] 서버 도구 목록:")
        for 이름, 정보 in self.도구목록.items():
            print(f"  📌 {이름}: {정보['설명']}")

    def 실행(self, 도구이름, 입력):
        if 도구이름 in self.도구목록:
            return self.도구목록[도구이름]["함수"](입력)
        return "도구 없음"

# 서버 만들기!
서버 = MCP서버("학습도우미")
서버.도구추가("단어수", "글자 수 세기", len)
서버.도구추가("뒤집기", "문자열 뒤집기", lambda x: x[::-1])
서버.도구추가("띄어쓰기", "단어 개수 세기", lambda x: len(x.split()))

서버.도구리스트()
print()
테스트문장 = "나는 코딩을 좋아해요"
print(f"입력: '{테스트문장}'")
print(f"  단어수: {서버.실행('단어수', 테스트문장)}")
print(f"  뒤집기: {서버.실행('뒤집기', 테스트문장)}")
print(f"  띄어쓰기: {서버.실행('띄어쓰기', 테스트문장)}")`,
    expectedOutput: '🖥️ [학습도우미] 서버 도구 목록:\n  📌 단어수: 글자 수 세기\n  📌 뒤집기: 문자열 뒤집기\n  📌 띄어쓰기: 단어 개수 세기\n\n입력: \'나는 코딩을 좋아해요\'\n  단어수: 10\n  뒤집기: 요해아좋 을딩코 는나\n  띄어쓰기: 3',
    hint: 'MCP 서버는 여러 도구를 모아둔 곳이에요. AI가 서버에 요청하면 알맞은 도구가 일을 해요!',
    packages: [],
  },

  // ═══════════════════════════════════════════
  // AI 포트폴리오 (ai-portfolio)
  // ═══════════════════════════════════════════

  'ai-portfolio-ch1-s1': {
    title: '📂 포트폴리오 만들기',
    description: '포트폴리오는 내가 만든 작품을 모아둔 것이에요! 자기소개와 프로젝트를 정리하는 프로그램을 만들어봐요.',
    initialCode: `# 나만의 AI 포트폴리오!
class 포트폴리오:
    def __init__(self, 이름, 소개):
        self.이름 = 이름
        self.소개 = 소개
        self.프로젝트 = []

    def 프로젝트추가(self, 제목, 설명, 기술):
        self.프로젝트.append({"제목": 제목, "설명": 설명, "기술": 기술})

    def 보여주기(self):
        print(f"👤 {self.이름}의 포트폴리오")
        print(f"📝 {self.소개}")
        print(f"\\n🎯 프로젝트 ({len(self.프로젝트)}개):")
        for i, p in enumerate(self.프로젝트, 1):
            print(f"  {i}. {p['제목']}")
            print(f"     설명: {p['설명']}")
            print(f"     기술: {', '.join(p['기술'])}")

내포폴 = 포트폴리오("김민수", "AI를 좋아하는 초등학생!")
내포폴.프로젝트추가("챗봇 만들기", "인사하는 챗봇", ["Python"])
내포폴.프로젝트추가("숫자 맞추기 게임", "AI와 숫자 대결", ["Python", "AI"])
내포폴.보여주기()`,
    expectedOutput: '👤 김민수의 포트폴리오\n📝 AI를 좋아하는 초등학생!\n\n🎯 프로젝트 (2개):\n  1. 챗봇 만들기\n     설명: 인사하는 챗봇\n     기술: Python\n  2. 숫자 맞추기 게임\n     설명: AI와 숫자 대결\n     기술: Python, AI',
    hint: '포트폴리오에 프로젝트를 추가할수록 점점 풍성해져요! 나중에 자랑할 수 있는 작품집이에요.',
    packages: [],
  },

  'ai-portfolio-ch3-s1': {
    title: '🧪 간단한 AI 모델 개발',
    description: 'AI 모델은 데이터에서 규칙을 찾아내는 프로그램이에요! 가장 간단한 AI 모델을 직접 만들어봐요.',
    initialCode: `# 나만의 간단한 AI 모델!
class 간단AI모델:
    def __init__(self):
        self.데이터 = {}

    def 학습(self, 입력, 출력):
        self.데이터[입력] = 출력

    def 예측(self, 입력):
        if 입력 in self.데이터:
            return self.데이터[입력]
        # 가장 비슷한 것 찾기
        가장가까운 = min(self.데이터.keys(),
            key=lambda x: abs(x - 입력))
        return self.데이터[가장가까운]

# 모델 학습!
모델 = 간단AI모델()
모델.학습(1, "매우 추움")
모델.학습(10, "추움")
모델.학습(20, "적당함")
모델.학습(30, "더움")
모델.학습(35, "매우 더움")

# 예측!
테스트 = [5, 15, 25, 33]
print("🌡️ 기온 예측 AI:")
for 온도 in 테스트:
    결과 = 모델.예측(온도)
    print(f"  {온도}도 → {결과}")`,
    expectedOutput: '🌡️ 기온 예측 AI:\n  5도 → 매우 추움\n  15도 → 추움\n  25도 → 적당함\n  33도 → 매우 더움',
    hint: 'AI 모델은 학습한 데이터 중에서 가장 가까운 것을 찾아 예측해요. 이것이 가장 기본적인 AI예요!',
    packages: [],
  },

  // ═══════════════════════════════════════════
  // RAG와 벡터 DB (rag-vector-db)
  // ═══════════════════════════════════════════

  'rag-vector-db-ch1-s1': {
    title: '🔢 임베딩이란?',
    description: '임베딩은 글자를 숫자로 바꾸는 거예요! 글자를 숫자로 바꾸면 컴퓨터가 비슷한 단어를 찾을 수 있어요.',
    initialCode: `# 간단한 임베딩 시뮬레이션!
# 단어를 숫자 좌표로 표현해요

단어좌표 = {
    "강아지": [9, 8],   # [귀여움, 동물성]
    "고양이": [8, 9],
    "로봇":   [2, 1],
    "컴퓨터": [1, 2],
    "햄스터": [9, 7],
}

def 거리계산(좌표1, 좌표2):
    차이 = sum((a-b)**2 for a, b in zip(좌표1, 좌표2))
    return round(차이 ** 0.5, 2)

# 비슷한 단어 찾기!
찾을단어 = "강아지"
print(f"🔍 '{찾을단어}'와 비슷한 단어 찾기:")
print(f"  좌표: {단어좌표[찾을단어]}")
print()

거리목록 = []
for 단어, 좌표 in 단어좌표.items():
    if 단어 != 찾을단어:
        거리 = 거리계산(단어좌표[찾을단어], 좌표)
        거리목록.append((단어, 거리))
        print(f"  {찾을단어} ↔ {단어}: 거리 {거리}")

가장가까운 = min(거리목록, key=lambda x: x[1])
print(f"\\n✨ 가장 비슷한 단어: {가장가까운[0]}")`,
    expectedOutput: '🔍 \'강아지\'와 비슷한 단어 찾기:\n  좌표: [9, 8]\n\n  강아지 ↔ 고양이: 거리 1.41\n  강아지 ↔ 로봇: 거리 9.9\n  강아지 ↔ 컴퓨터: 거리 10.0\n  강아지 ↔ 햄스터: 거리 1.0\n\n✨ 가장 비슷한 단어: 햄스터',
    hint: '임베딩은 단어를 좌표(숫자)로 바꿔요. 좌표가 가까울수록 비슷한 단어예요! 강아지와 햄스터가 가깝죠?',
    packages: [],
  },

  'rag-vector-db-ch3-s1': {
    title: '📚 RAG 시스템 체험',
    description: 'RAG는 AI가 답변할 때 관련 문서를 먼저 찾아보는 시스템이에요! 검색 + 답변 생성을 체험해봐요.',
    initialCode: `# 간단한 RAG 시스템!
# 1. 문서 저장소
문서들 = {
    "파이썬": "Python은 1991년 만들어진 프로그래밍 언어예요.",
    "AI": "AI는 인공지능으로, 컴퓨터가 사람처럼 생각하는 기술이에요.",
    "머신러닝": "머신러닝은 AI의 한 분야로, 데이터에서 패턴을 찾아요.",
    "딥러닝": "딥러닝은 신경망을 깊게 쌓은 머신러닝 방법이에요.",
}

# 2. 검색 (키워드 매칭)
def 검색(질문):
    결과 = []
    for 키워드, 내용 in 문서들.items():
        if 키워드 in 질문:
            결과.append((키워드, 내용))
    return 결과

# 3. 답변 생성 (검색 결과 기반)
def RAG답변(질문):
    print(f"❓ 질문: {질문}")
    찾은문서 = 검색(질문)
    if 찾은문서:
        print(f"  📖 검색 결과 {len(찾은문서)}건:")
        for 키, 내용 in 찾은문서:
            print(f"    - [{키}] {내용}")
    else:
        print("  📖 관련 문서 없음")

질문들 = ["AI가 뭐야?", "머신러닝 알려줘", "노래 추천해줘"]
for q in 질문들:
    RAG답변(q)
    print()`,
    expectedOutput: '❓ 질문: AI가 뭐야?\n  📖 검색 결과 1건:\n    - [AI] AI는 인공지능으로, 컴퓨터가 사람처럼 생각하는 기술이에요.\n\n❓ 질문: 머신러닝 알려줘\n  📖 검색 결과 1건:\n    - [머신러닝] 머신러닝은 AI의 한 분야로, 데이터에서 패턴을 찾아요.\n\n❓ 질문: 노래 추천해줘\n  📖 관련 문서 없음\n',
    hint: 'RAG는 AI가 답하기 전에 "문서를 먼저 찾아보자!"라고 하는 거예요. 관련 문서가 있으면 더 정확한 답을 해요!',
    packages: [],
  },

  // ═══════════════════════════════════════════
  // AI 비즈니스 (ai-business)
  // ═══════════════════════════════════════════

  'ai-business-ch1-s1': {
    title: '💼 AI 비즈니스란?',
    description: 'AI를 사용해서 돈을 벌 수 있는 사업을 만들어요! 간단한 AI 서비스 사업 계획을 시뮬레이션해봐요.',
    initialCode: `# AI 비즈니스 시뮬레이션!
class AI서비스:
    def __init__(self, 이름, 가격, 비용):
        self.이름 = 이름
        self.가격 = 가격  # 한 건당 가격
        self.비용 = 비용  # 한 건당 비용
        self.고객수 = 0

    def 서비스실행(self, 고객수):
        self.고객수 = 고객수
        수익 = self.가격 * 고객수
        총비용 = self.비용 * 고객수
        이익 = 수익 - 총비용
        return {"수익": 수익, "비용": 총비용, "이익": 이익}

# 3가지 AI 서비스 비교!
서비스들 = [
    AI서비스("AI 번역", 1000, 300),
    AI서비스("AI 그림", 2000, 800),
    AI서비스("AI 과외", 5000, 1500),
]

print("💰 AI 비즈니스 비교 (고객 100명 기준):")
for 서비스 in 서비스들:
    결과 = 서비스.서비스실행(100)
    print(f"\\n  📌 {서비스.이름}")
    print(f"     수익: {결과['수익']:,}원")
    print(f"     비용: {결과['비용']:,}원")
    print(f"     이익: {결과['이익']:,}원")`,
    expectedOutput: '💰 AI 비즈니스 비교 (고객 100명 기준):\n\n  📌 AI 번역\n     수익: 100,000원\n     비용: 30,000원\n     이익: 70,000원\n\n  📌 AI 그림\n     수익: 200,000원\n     비용: 80,000원\n     이익: 120,000원\n\n  📌 AI 과외\n     수익: 500,000원\n     비용: 150,000원\n     이익: 350,000원',
    hint: '비즈니스에서 중요한 것은 수익(받는 돈) - 비용(드는 돈) = 이익이에요!',
    packages: [],
  },

  'ai-business-ch3-s1': {
    title: '🎯 AI 프로젝트 선정하기',
    description: '좋은 AI 프로젝트를 고르려면 여러 기준으로 평가해야 해요! 점수를 매겨서 가장 좋은 프로젝트를 골라봐요.',
    initialCode: `# AI 프로젝트 평가 시스템!
프로젝트들 = [
    {"이름": "AI 날씨 앱", "난이도": 3, "재미": 8, "유용성": 7, "학습효과": 6},
    {"이름": "AI 퀴즈 게임", "난이도": 4, "재미": 9, "유용성": 6, "학습효과": 8},
    {"이름": "AI 일기장", "난이도": 2, "재미": 5, "유용성": 8, "학습효과": 7},
    {"이름": "AI 그림판", "난이도": 7, "재미": 10, "유용성": 5, "학습효과": 9},
]

# 종합 점수 계산 (난이도는 낮을수록 좋아요)
def 종합점수(프로젝트):
    점수 = (10 - 프로젝트["난이도"]) * 0.2
    점수 += 프로젝트["재미"] * 0.3
    점수 += 프로젝트["유용성"] * 0.2
    점수 += 프로젝트["학습효과"] * 0.3
    return round(점수, 1)

print("📊 AI 프로젝트 평가:")
for p in 프로젝트들:
    점수 = 종합점수(p)
    p["종합"] = 점수
    print(f"  {p['이름']}: {점수}점")

최고 = max(프로젝트들, key=lambda x: x["종합"])
print(f"\\n🏆 추천 프로젝트: {최고['이름']}!")`,
    expectedOutput: '📊 AI 프로젝트 평가:\n  AI 날씨 앱: 6.7점\n  AI 퀴즈 게임: 7.3점\n  AI 일기장: 6.7점\n  AI 그림판: 7.0점\n\n🏆 추천 프로젝트: AI 퀴즈 게임!',
    hint: '프로젝트를 고를 때는 재미, 유용성, 학습효과 등 여러 기준으로 점수를 매겨서 비교해봐요!',
    packages: [],
  },

  // ═══════════════════════════════════════════
  // AI 평가 (ai-evaluation)
  // ═══════════════════════════════════════════

  'ai-evaluation-ch1-s1': {
    title: '📏 AI 평가가 왜 필요할까?',
    description: 'AI가 잘 하고 있는지 확인하려면 평가가 필요해요! 간단한 AI 퀴즈 채점 시스템으로 평가를 체험해봐요.',
    initialCode: `# AI 평가 시스템!
def AI퀴즈():
    문제들 = [
        {"질문": "1+1=?", "정답": "2", "AI답": "2"},
        {"질문": "수도는?", "정답": "서울", "AI답": "서울"},
        {"질문": "색깔은?", "정답": "파란색", "AI답": "빨간색"},
        {"질문": "3x4=?", "정답": "12", "AI답": "12"},
        {"질문": "계절은?", "정답": "여름", "AI답": "겨울"},
    ]

    맞춤 = 0
    print("📝 AI 시험 결과:")
    for 문제 in 문제들:
        맞음 = 문제["정답"] == 문제["AI답"]
        기호 = "✅" if 맞음 else "❌"
        if 맞음:
            맞춤 += 1
        print(f"  {기호} {문제['질문']} (AI: {문제['AI답']}, 정답: {문제['정답']})")

    정확도 = 맞춤 / len(문제들) * 100
    print(f"\\n📊 성적: {맞춤}/{len(문제들)} ({정확도:.0f}%)")
    if 정확도 >= 80:
        print("평가: 우수한 AI! 🌟")
    elif 정확도 >= 60:
        print("평가: 보통 수준 📚")
    else:
        print("평가: 더 학습 필요 💪")

AI퀴즈()`,
    expectedOutput: '📝 AI 시험 결과:\n  ✅ 1+1=? (AI: 2, 정답: 2)\n  ✅ 수도는? (AI: 서울, 정답: 서울)\n  ❌ 색깔은? (AI: 빨간색, 정답: 파란색)\n  ✅ 3x4=? (AI: 12, 정답: 12)\n  ❌ 계절은? (AI: 겨울, 정답: 여름)\n\n📊 성적: 3/5 (60%)\n평가: 보통 수준 📚',
    hint: 'AI 평가는 정답과 AI의 답을 비교해서 맞춘 비율(정확도)을 계산하는 거예요!',
    packages: [],
  },

  'ai-evaluation-ch2-s1': {
    title: '📊 벤치마크 테스트',
    description: '벤치마크는 여러 AI를 같은 시험으로 비교하는 거예요! AI들의 성능을 비교하는 시스템을 만들어봐요.',
    initialCode: `# AI 벤치마크 시스템!
import random
random.seed(42)

class AI모델:
    def __init__(self, 이름, 실력):
        self.이름 = 이름
        self.실력 = 실력  # 0~100

    def 시험보기(self, 문제수):
        맞춤 = sum(1 for _ in range(문제수)
                   if random.random() * 100 < self.실력)
        return 맞춤

# 3개 AI 모델 비교!
모델들 = [
    AI모델("기본AI", 60),
    AI모델("좋은AI", 80),
    AI모델("최고AI", 95),
]

문제수 = 10
print("🏆 AI 벤치마크 테스트:")
print(f"   (문제 {문제수}개)\\n")

결과 = []
for 모델 in 모델들:
    random.seed(42)
    점수 = 모델.시험보기(문제수)
    정확도 = 점수 / 문제수 * 100
    결과.append((모델.이름, 점수, 정확도))
    막대 = "█" * 점수 + "░" * (문제수 - 점수)
    print(f"  {모델.이름}: {막대} {점수}/{문제수} ({정확도:.0f}%)")

최고 = max(결과, key=lambda x: x[1])
print(f"\\n🥇 1등: {최고[0]}!")`,
    expectedOutput: '🏆 AI 벤치마크 테스트:\n   (문제 10개)\n\n  기본AI: ██████░░░░ 6/10 (60%)\n  좋은AI: ████████░░ 8/10 (80%)\n  최고AI: █████████░ 9/10 (90%)\n\n🥇 1등: 최고AI!',
    hint: '벤치마크는 같은 시험을 여러 AI에게 보게 해서 누가 더 잘하는지 비교하는 거예요!',
    packages: [],
  },
}
